import requests
from bs4 import BeautifulSoup
import json
import re
import time
from urllib.parse import urljoin

BASE_URL = "https://www.aja.fr"
TEAM_URL = f"{BASE_URL}/equipes/equipe-pro/"

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/122.0.0.0 Safari/537.36"
}

def get_soup(url, timeout=10):
    res = requests.get(url, headers=HEADERS, timeout=timeout)
    res.raise_for_status()
    return BeautifulSoup(res.text, "html.parser")

def extract_image_url_from_tag(tag):
    """Donne l'URL d'image à partir d'un tag <img> (ou ses environs)."""
    if tag is None:
        return None

    # 1) attributs courants (ordre d'essai)
    candidates = [
        "data-src",
        "data-srcset",
        "data-lazy",
        "data-original",
        "data-lazy-src",
        "data-lazy-srcset",
        "data-ll-src",
        "data-bg",
        "data-image",
        "srcset",
    ]
    for attr in candidates:
        val = tag.get(attr)
        if val:
            # si c'est un srcset, prendre la première url
            if "," in val:
                val = val.split(",")[0].strip().split(" ")[0]
            return val

    # 2) src normal mais ignorer placeholders (data: ou tiny transparent)
    src = tag.get("src")
    if src and not src.startswith("data:") and src.strip() != "":
        return src

    # 3) chercher un <noscript> proche (souvent utilisé pour fallback)
    # le noscript peut contenir un <img src="...">
    ns = None
    # sibling noscript
    sib = tag.find_next_sibling("noscript")
    if sib:
        ns = sib
    else:
        # parfois le noscript est dans l'élément parent
        parent = tag.parent
        if parent:
            ns = parent.find("noscript")
    if ns:
        ns_soup = BeautifulSoup(ns.decode_contents(), "html.parser")
        ns_img = ns_soup.find("img")
        if ns_img and ns_img.get("src"):
            return ns_img.get("src")

    # 4) vérifier style (background-image) sur l'élément ou un ancêtre proche
    el = tag
    for i in range(4):  # remonte jusqu'à 4 niveaux
        if el and el.has_attr("style"):
            m = re.search(r'url\((?:["\']?)(.*?)(?:["\']?)\)', el["style"])
            if m:
                return m.group(1)
        el = el.parent

    # rien trouvé
    return None

def parse_player_details(fiche_url):
    soup = get_soup(fiche_url)
    details = {
        "date_naissance": None,
        "age": None,
        "ville": None,
        "taille": None,
        "poids": None,
        "pied": None,
        "image_url": None,
    }

    # --- infos standard ---
    infos = soup.select("ul.player-info__list li.player-info__item")
    for item in infos:
        key = item.select_one(".player-info__item-key").get_text(strip=True)
        value = item.select_one(".player-info__item-value").get_text(strip=True)

        if "Date de naissance" in key:
            details["date_naissance"] = value.split("(")[0].strip()
            age_match = re.search(r"\((\d+)\s?ans\)", value)
            if age_match:
                details["age"] = int(age_match.group(1))
        elif "Ville" in key:
            details["ville"] = value
        elif "Taille" in key:
            details["taille"] = value
        elif "Poids" in key:
            details["poids"] = value
        elif "Pied" in key:
            details["pied"] = value

    # --- récupérer l’image ---
    # Sur les fiches, l’URL finale est dans un <img> ou dans <meta property="og:image">
    img_tag = soup.select_one("img.player-preview__image, .player-head img, .player-photo img")
    if img_tag and img_tag.get("src"):
        details["image_url"] = img_tag["src"]
    else:
        og = soup.find("meta", property="og:image")
        if og and og.get("content"):
            details["image_url"] = og["content"]

    return details

def scrape_team():
    soup = get_soup(TEAM_URL)
    players_cards = soup.find_all("article", class_="player-preview")
    all_players_data = []

    for idx, player in enumerate(players_cards, 1):
        name_el = player.select_one("h3.player-preview__title")
        pos_el = player.select_one("span.player-preview__subtitle")
        name = name_el.get_text(strip=True) if name_el else None
        position = pos_el.get_text(strip=True) if pos_el else None

        number_tag = player.select_one("span.player-preview__number")
        number = number_tag.get_text(strip=True).replace("#", "") if number_tag else None

        link_el = player.select_one("a.player-preview__link")
        link = link_el["href"] if link_el and link_el.has_attr("href") else None
        fiche_url = urljoin(BASE_URL, link) if link else None

        # tentative rapide sur la vignette (peut être placeholder)
        img_tag_listing = player.select_one("img.player-preview__image")
        img_listing_url = extract_image_url_from_tag(img_tag_listing)
        if img_listing_url:
            img_listing_url = urljoin(BASE_URL, img_listing_url)

        print(f"🔄 {idx}/{len(players_cards)} : {name} → {fiche_url}")

        time.sleep(1)  # déjà présent — ok

        # Récupère les détails (et l'image) depuis la fiche joueur — plus fiable
        details = {}
        try:
            details = parse_player_details(fiche_url) if fiche_url else {}
        except Exception as e:
            print(f"⚠️ Erreur sur parse_player_details pour {name} ({fiche_url}) : {e}")
            details = {}

        # Prioriser l'URL trouvée sur la fiche, sinon celle de la liste
        image_url_final = details.get("image_url") or img_listing_url

        player_data = {
            "nom": name,
            "poste": position,
            "numéro": number,
            "fiche_url": fiche_url,
            "image_url": image_url_final,
            **{k: v for k, v in details.items() if k != "image_url"},
        }

        # debug: afficher attributs si image manquante
        if not image_url_final:
            print("  → image introuvable; attrs listing:", getattr(img_tag_listing, 'attrs', None))

        all_players_data.append(player_data)

    return all_players_data

def main():
    data = scrape_team()

    with open("./public/data/players_data.json", "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

    print(f"✅ {len(data)} joueurs enregistrés dans players_data.json")

if __name__ == "__main__":
    main()
