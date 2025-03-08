import requests

URL = 
location = "delhi technological university"

PARAMS = {'address':location}

r = requests.get(url = URL, params = PARAMS)

data = r.json()


latitude = data['results'][0]['geometry']['location']['lat']
longitude = data['results'][0]['geometry']['location']['lng']
formatted_address = data['results'][0]['formatted_address']

print("Latitude:%s\nLongitude:%s\nFormatted Address:%s"
    %(latitude, longitude,formatted_address))
