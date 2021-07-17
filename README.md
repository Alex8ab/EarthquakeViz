# Earthquakes Vizualization
Set of tools that allow visualizing earthquake data in leaflet maps. The United States Geological Survey (USGS) collects a massive amount of data from all over the world each day about natural hazards, the health of our ecosystems and environment; and the impacts of climate and land-use change. This project displays the earthquake data over a leaflet map to give it more meaning.

The USGS provides earthquake data in Json format from the past 7 days, this information is used to display the magnitude and place.
**Data Source:** [USGS - GeoJSON Summary Format](https://earthquake.usgs.gov/earthquakes/feed/v1.0/geojson.php)

## Step 1
**Objetive:** Create a map that allows visualize earthquake data.

Map includes:

- Markers that reflect the magnitude of the earthquake in their size and color. Earthquakes with higher magnitudes appear larger and darker in color.
- Popups that provide the place, time, and magnitude of the earthquake when a marker is clicked.
- A legend that shows the grades of magnitude.

![Earthquake step 1](/Earthquake1.png)

## Step 2
**Objetive:** Create a map to illustrate the relationship between tectonic plates and seismic activity.

Map includes:

- All specifications from Step 1.
- Base maps to choose from two different data sets into an overlay that can be turned on and off independently.
- Layer controls.

![Earthquake step 2-1](/Earthquake2.png)

![Earthquake step 2-2](/Earthquake3.png)
