import requests
from bs4 import BeautifulSoup
import json
import re
import time

BASE_URL = "https://www.aja.fr"
TEAM_URL = f"{BASE_URL}/equipes/equipe-pro/"

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/122.0.0.0 Safari/537.36"
}

def get_soup(url, timeout=10):
    res = requests.get(url, headers=HEADERS, timeout=timeout)
    res.raise_for_status()
    return BeautifulSoup(res.text, "html.parser")

def parse_player_details(fiche_url):
    soup = get_soup(fiche_url)
    infos = soup.select("ul.player-info__list li.player-info__item")

    details = {
        "date_naissance": None,
        "age": None,
        "ville": None,
        "taille": None,
        "poids": None,
        "pied": None
    }

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

    return details

def scrape_team():
    soup = get_soup(TEAM_URL)
    players_cards = soup.find_all("article", class_="player-preview")
    all_players_data = []

    for idx, player in enumerate(players_cards, 1):
        name = player.select_one("h3.player-preview__title").get_text(strip=True)
        position = player.select_one("span.player-preview__subtitle").get_text(strip=True)
        
        number_tag = player.select_one("span.player-preview__number")
        number = number_tag.get_text(strip=True).replace("#", "") if number_tag else None

        link = player.select_one("a.player-preview__link")["href"]
        fiche_url = link if link.startswith("http") else BASE_URL + link

        img_tag = player.select_one("img.player-preview__image")
        image_url = img_tag["src"] if img_tag else None

        print(f"🔄 {idx}/{len(players_cards)} : {name} → {fiche_url}")
        
        # Pause légère pour éviter le blocage serveur
        time.sleep(1)

        # Récupère les détails
        try:
            details = parse_player_details(fiche_url)
        except Exception as e:
            print(f"⚠️ Erreur sur {name} ({fiche_url}) : {e}")
            details = {}

        player_data = {
            "nom": name,
            "poste": position,
            "numéro": number,
            "fiche_url": fiche_url,
            "image_url": image_url,
            **details
        }

        all_players_data.append(player_data)

    return all_players_data

def main():
    data = scrape_team()

    with open("./public/data/players_data.json", "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

    print(f"✅ {len(data)} joueurs enregistrés dans players_data.json")

if __name__ == "__main__":
    main()
