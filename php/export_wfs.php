<?php
    include('tempdir.php');

    // will write to temp dir
    $tmpdir = "/home/umberto/Documents/apps/projects/shire/tmp";
    //$tmpdir = dirname(__DIR__) . DIRECTORY_SEPARATOR . 'tmp'; // !!! EVERYTHING WILL BE CREATED HERE !!!
    //$tmpdir = sys_get_temp_dir(); // !!! EVERYTHING WILL BE CREATED HERE !!!
    $outdir = tempdir($tmpdir);
    $format = escapeshellarg($_POST["format"]); // e.g. "ESRI Shapefile";
    switch ($format) {
        case "'ESRI Shapefile'":
            $output =  $outdir . DIRECTORY_SEPARATOR . "export.shp";
            break;
        case "'CSV'":
            $output =  $outdir . DIRECTORY_SEPARATOR . "export.csv";
            break;
        case "'KML'":
            $output =  $outdir . DIRECTORY_SEPARATOR . "export.kml";
            break;
        case "'DXF'":
            $output =  $outdir . DIRECTORY_SEPARATOR . "export.dxf";
            break;
    }

    $getfeature_url = escapeshellarg($_POST["wfs_url"]);
    //$getfeature_url = "https://www.wondermap.it/cgi-bin/qgis_mapserv.fcgi?map=/home/ubuntu/qgis/projects/Demo_sci_WMS/demo_sci.qgs&SERVICE=WFS&VERSION=1.1.0&REQUEST=GetFeature&TYPENAME=domini_sciabili&";

    // convert WFS into a given format and place result in folder
    $ogr2ogr = "ogr2ogr -f $format $output WFS:$getfeature_url";
    exec($ogr2ogr);

    // zip up the contents
    // chdir($tmpdir);
    $zipName = uniqid('wondermap_') . '.zip'; // uniqid('prefix', true) . '.pdf';
    $zipFile = $tmpdir . DIRECTORY_SEPARATOR . $zipName;
    $zipCommand = "zip -rj $zipFile $outdir";
    exec($zipCommand);

    // force client download
    if (headers_sent()) {
        echo 'HTTP header already sent';
    } else {
        if (!is_file($zipFile)) {
        header($_SERVER['SERVER_PROTOCOL'].' 404 Not Found');
        echo $zipFile . ' not found';
        } else if (!is_readable($zipFile)) {
            header($_SERVER['SERVER_PROTOCOL'].' 403 Forbidden');
            echo $zipFile . ' not readable';
        } else {
            ob_start();
            // http headers for zip downloads
            header('Content-Description: File Transfer');
            header('Content-Type: application/zip');
            header('Content-Disposition: attachment; filename="' . $zipName . '"');
            header('Content-Transfer-Encoding: binary');
            header('Connection: Keep-Alive');
            header('Expires: 0');
            header('Cache-Control: must-revalidate, post-check=0, pre-check=0');
            header('Pragma: public');

            set_time_limit(0);
            ob_flush();
            ob_clean();
            readfile($zipFile);
        }
    }

    // delete zip afterwards
    if (!unlink($zipFile)) {
        echo ("Error deleting $zipFile");
    } else {
        echo ("Deleted $zipFile");
    }

    // delete folder afterwards
    array_map('unlink', glob("$outdir/*.*"));
    rmdir($outdir);
?>
