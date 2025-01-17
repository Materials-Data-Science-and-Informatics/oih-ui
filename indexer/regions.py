import os
import json
import csv
import re

import shapely
import shapely.wkt
import shapely.geometry


###
#  Geometry to regions
#
# This takes any feature that's represented in WKT format and checks
# for intersecting regions from the geojson. Additional regions can be
# added to the geojson as required, there's no requirement that the
# regions be non-overlapping.


with open(os.path.join(os.path.dirname(__file__),'regions-clipped.geojson'), 'r') as f:
    geo_regions = json.load(f)['features']
    for r in geo_regions:
        r['shape'] = shapely.geometry.shape(r['geometry'])

def regionsForFeature(feature):
    the_geom= shapely.wkt.loads(feature)
    return [r['properties']['name'] for r in geo_regions if r['shape'].intersects(the_geom)]


###
#  Text address
# This is a super simple geocoder -- if there's an address that contains
# a country that's spelled like we have in the CSV file, we take the
# region from there. Note that the region doesn't exactly map to what
# we're using elsewhere, so we should probably hand edit a country ->
# region listing instead of using the UN one straight out.

# Algorithim:
# * lower everything.
# * removing anything in parens e.g., we want Iran to match, not require
#   Iran(Islamic Republic of),
# * Remove stop words.
# * Split on whitespace

# Then, for any address, we check to see if any of the countries are in
# the address, and map away from there.  Note, Cote d'Ivoire and Timor
# Leste are going to potentially have accent issues.
#
# Note -- this is a linear search, but there are only 200 countries so it's not that bad.

with open(os.path.join(os.path.dirname(__file__),'UNSD.Methodology.csv'), 'r') as f:
    dialect = csv.register_dialect('semi', delimiter=';', quoting=csv.QUOTE_NONE)
    reader = csv.DictReader(f, dialect='semi')
    text_regions = {line['Country or Area'].lower():line['Region Name'] for line in reader}
    def normalize(s):
        s = s.lower()
        s = re.sub(r"\(.*\)","",s)
        s = re.sub(r"and|the|of","", s)
        return set(s.split(None))
    country_map_list = [(normalize(country),country) for country in text_regions.keys()]

def regionForAddress(address):
    normalized = normalize(address)
    for parts, country in country_map_list:
        if parts <= normalized:
            return text_regions[country]

if __name__ == '__main__':

    for feature in (
            'POLYGON ((-95.5 19.5,-95.5 31.5,-73.5 31.5,-73.5 19.5,-95.5 19.5))',
            'POLYGON ((144.401499 13.11742,144.401499 15.622688,145.8872 15.622688,145.8872 13.11742,144.401499 13.11742))',
            'POINT (0 0)',
            'POINT (-9 53)'):
        print( regionsForFeature(feature))

    for address in (
            'IOC Science and Communication Centre on Harmful Algae, University of Copenhagen - University of Copenhagen, Department of Biology - DK-1353 K\u00f8benhavn K - Denmark',
            ):
        print(regionForAddress(address))
