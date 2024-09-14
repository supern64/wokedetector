import requests
from bs4 import BeautifulSoup

main_url = "https://store.steampowered.com/curator/44927664/ajaxgetfilteredrecommendations?query"

mapping = {
    "color_not_recommended": -1,
    "color_informational": 0,
    "color_recommended": 1
}

# discover size
size_r = requests.get(main_url + "&count=1")
size = size_r.json()["total_count"]

print(f"Downloading list of {size} games")
list_r = requests.get(main_url + f"&count={size}")
list_j = list_r.json()
if list_j["success"] != 1:
    print("Failed to download list of games, exiting...")
    exit(1)

print("Parsing data for games")
with open("data.csv", "w+", encoding="utf-8") as file:
    file.write("appid,name,banner,woke,description\n")

    soup = BeautifulSoup(list_j["results_html"], "html.parser")
    for rec in soup.find_all(class_="recommendation"):
        id = rec.a["data-ds-appid"]
        name = rec.a.img["alt"].replace('"','""')
        banner = rec.a.img["src"]
        woke = mapping[rec.span["class"][0]]
        description = rec.find(class_="recommendation_desc").text.strip().replace('"','""')
        file.write(f"{id},\"{name}\",\"{banner}\",{woke},\"{description}\"\n")
print("Done")