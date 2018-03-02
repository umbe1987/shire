A WebGIS Portal prototype which makes use of various open source projects (Open Layers, MapServer, SQLite/Spatialite, Turbo87/sidebar-v2, PROJ4, and hopefully I don't forget anything...).

To try it out, just download the [latest proj4 dist folder](https://github.com/proj4js/proj4js/releases) and place it in the `ol/` directory.

Also, change the path of the mapserv aplication to your actual path (MapServer is required) both in `map.html` (root dir) and in `./mapfile/mapfile/mymap.map`.

The files with "VPN" suffix are meant only for tests of this repository's owner and should not be used.

Finally, the project is meant to work in HTTPS only. Some issues are expected when tested with HTTP.

Tested on linux and Windows. For Windows users: path might require o change the dir separator from '\\' to '\\\'.
