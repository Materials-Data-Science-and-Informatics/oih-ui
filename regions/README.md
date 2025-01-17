## Regions

This folder contains the source data used to classify the objects in the graph into regions.

Regions.qgs (qgis) and regions.gpkg (geopackage) are the source files that define an arbitrary set of regions. Each of the regions on the map is a polygon, with an attached region name. There can be multiple regions of the same name, for example, when specifying a region that spans the antimeridian.  All regions should be clipped to not exceed +0-90 and +- 180 degrees.  After modification, the regions should be exported to a geojson format and placed in the indexing folder. Reindexing of the geographical data is then required to update the region assigned to each object in the graph.

Note that the regions shown here are rough mappings, and were intended as a demonstration of an approach for mapping spatial data to the regions, not as an assertion of a particular region for a particular point.

Address data is matched to the country list sourced from https://unstats.un.org/unsd/methodology/m49/overview, also included here.
