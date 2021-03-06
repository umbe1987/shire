<?php
  session_start();
  if (isset($_SESSION['userId'])) {
    if (isset($_GET['mapid'])) {
    
      require '../includes/dbh.inc.php';
      
      $mapid = $_GET['mapid']; // e.g. 1
      $sql = "SELECT \"titleMaps\", \"wmsMaps\" FROM maps WHERE \"idMaps\" = $1;";
      $result = pg_query_params($conn, $sql, array($mapid));
      if ($result) {
        $records = pg_num_rows($result);
        if ($records < 1) {
        header("Location: ../index.php?error=mapnotfound");
        exit();
      }
      else {
        while ($row = pg_fetch_row($result)) {
          // HTML GOES HERE
?>

<!DOCTYPE html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>Wondermap Map Viewer</title>
    <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.3.1/css/all.css" integrity="sha384-mzrmE5qonljUremFsqc01SB46JvROS7bZs3IO2EmfFsd15uHvIt+Y8vEf7N7fWAU" crossorigin="anonymous">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/proj4js/2.4.4/proj4.js"></script>
    <!-- The line below is only needed for old environments like Internet Explorer and Android 4.x -->
    <script src="https://cdn.polyfill.io/v2/polyfill.min.js?features=requestAnimationFrame,Element.prototype.classList,URL"></script>
    <link rel="stylesheet" type="text/css" href="dist/index.css">
</head>
<body>
    <!-- Map Title -->
    <div id="mapTitle">
        <h2><?php echo $row[0]; ?></h2>
    </div>
    <!-- The Modal -->
    <div id="alertModal" class="modal">
        <!-- Modal content -->
        <div class="modal-content">
            <div class="modal-header">
                <span class="close">&times;</span>
            </div>
            <div class="modal-body"></div>
            <div class="modal-footer"></div>
        </div>
    </div>
    <div id="mapContent">
    <div class="arrow-down"></div>
    <div id="sidebar" class="sidebar collapsed">
        <!-- Nav tabs -->
        <div class="sidebar-tabs">
            <ul role="tablist">
                <li><a href="#toc" role="tab"><i class="fa fa-bars"></i></a></li>
                <li><a href="#print" role="tab"><i class="fas fa-print"></i></a></li>
                <li><a href="#position" role="tab"><i class="fas fa-crosshairs"></i></a></li>
            </ul>
            <ul role="tablist">
                <li><a href="#settings" role="tab"><i class="fa fa-gear"></i></a></li>
            </ul>
        </div>
        <!-- Tab panes -->
        <div class="sidebar-content">
            <div class="sidebar-pane" id="toc">
                <div>
                    <h1 class="sidebar-header">Layers<span class="sidebar-close"><i class="fa fa-caret-left"></i></span></h1>
                </div>
                <!-- !!! HERE WILL GO THE CONTENT OF LAYERSWITCHER !!! -->
                <div id="layers" class="sidebar-content layer-switcher" style="top: 40px;left: 0px;overflow:auto;"></div>
            </div>
            <div class="sidebar-pane" id="print">
                <div>
                    <h1 class="sidebar-header">Print<span class="sidebar-close"><i class="fa fa-caret-left"></i></span></h1>
                </div>
                <div class="sidebar-content" style="top: 40px;left: 20px;overflow:auto;">
                <form class="form">
                    <p>Page size </p>
                    <select id="format">
                        <option value="a0">A0 (slow)</option>
                        <option value="a1">A1</option>
                        <option value="a2">A2</option>
                        <option value="a3">A3</option>
                        <option value="a4" selected>A4</option>
                        <option value="a5">A5 (fast)</option>
                    </select><br>
                    <p>Orientation </p>
                    <select id="orientation">
                        <option value="p">portrait</option>
                        <option value="l">landscape</option>
                    </select><br>
                    <p>Resolution </p>
                    <select id="resolution">
                        <option value="72">72 dpi (fast)</option>
                        <option value="150">150 dpi</option>
                        <option value="300">300 dpi (slow)</option>
                    </select>
                </form>
                <button class="wm-btn" id="export-pdf">Export PDF</button>
                </div>
            </div>
            <div class="sidebar-pane" id="position">
                <h1 class="sidebar-header">
                    Geolocation
                    <span class="sidebar-close"><i class="fa fa-caret-left"></i></span>
                </h1>
                <label for="track">
                track position
                <input id="track" type="checkbox"/>
                </label>
                <p id="location_err" style="display: none;"></p>
            </div>
            <div class="sidebar-pane" id="settings">
                <h1 class="sidebar-header">Settings<span class="sidebar-close"><i class="fa fa-caret-left"></i></span></h1>
            </div>
        </div>
    </div>
    <div id="map" class="sidebar-map"></div>
    </div>
    <script type="text/javascript">
        var service_url = '<?php echo $row[1];?>';
    </script>
    <script src="dist/index.js"></script>
</body>
</html>

<?php
        }
      }
    }
    else {
      header("Location: ../index.php?error=sqlerror");
      exit();
    }
  }
  pg_close($conn);
  }
  elseif (file_exists('./DEVMACHINE')) {
      // HTML GOES HERE (FOR DEBUG)
?>

<!DOCTYPE html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>Wondermap Map Viewer</title>
    <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.3.1/css/all.css" integrity="sha384-mzrmE5qonljUremFsqc01SB46JvROS7bZs3IO2EmfFsd15uHvIt+Y8vEf7N7fWAU" crossorigin="anonymous">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/proj4js/2.4.4/proj4.js"></script>
    <!-- The line below is only needed for old environments like Internet Explorer and Android 4.x -->
    <script src="https://cdn.polyfill.io/v2/polyfill.min.js?features=requestAnimationFrame,Element.prototype.classList,URL"></script>
    <link rel="stylesheet" type="text/css" href="dist/index.css">
</head>
<body>
    <!-- Map Title -->
    <div id="mapTitle">
        <h2>DEBUG</h2>
    </div>
    <!-- The Modal -->
    <div id="alertModal" class="modal">
        <!-- Modal content -->
        <div class="modal-content">
            <div class="modal-header">
                <span class="close">&times;</span>
            </div>
            <div class="modal-body"></div>
            <div class="modal-footer"></div>
        </div>
    </div>
    <div id="mapContent">
    <div class="arrow-down"></div>
    <div id="sidebar" class="sidebar collapsed">
        <!-- Nav tabs -->
        <div class="sidebar-tabs">
            <ul role="tablist">
                <li><a href="#toc" role="tab"><i class="fa fa-bars"></i></a></li>
                <li><a href="#print" role="tab"><i class="fas fa-print"></i></a></li>
                <li><a href="#position" role="tab"><i class="fas fa-crosshairs"></i></a></li>
            </ul>
            <ul role="tablist">
                <li><a href="#settings" role="tab"><i class="fa fa-gear"></i></a></li>
            </ul>
        </div>
        <!-- Tab panes -->
        <div class="sidebar-content">
            <div class="sidebar-pane" id="toc">
                <div>
                    <h1 class="sidebar-header">Layers<span class="sidebar-close"><i class="fa fa-caret-left"></i></span></h1>
                </div>
                <!-- !!! HERE WILL GO THE CONTENT OF LAYERSWITCHER !!! -->
                <div id="layers" class="sidebar-content layer-switcher" style="top: 40px;left: 0px;overflow:auto;"></div>
            </div>
            <div class="sidebar-pane" id="print">
                <div>
                    <h1 class="sidebar-header">Print<span class="sidebar-close"><i class="fa fa-caret-left"></i></span></h1>
                </div>
                <div class="sidebar-content" style="top: 40px;left: 20px;overflow:auto;">
                <form class="form">
                    <p>Page size </p>
                    <select id="format">
                        <option value="a0">A0 (slow)</option>
                        <option value="a1">A1</option>
                        <option value="a2">A2</option>
                        <option value="a3">A3</option>
                        <option value="a4" selected>A4</option>
                        <option value="a5">A5 (fast)</option>
                    </select><br>
                    <p>Orientation </p>
                    <select id="orientation">
                        <option value="p">portrait</option>
                        <option value="l">landscape</option>
                    </select><br>
                    <p>Resolution </p>
                    <select id="resolution">
                        <option value="72">72 dpi (fast)</option>
                        <option value="150">150 dpi</option>
                        <option value="300">300 dpi (slow)</option>
                    </select>
                </form>
                <button class="wm-btn" id="export-pdf">Export PDF</button>
                </div>
            </div>
            <div class="sidebar-pane" id="position">
                <h1 class="sidebar-header">
                    Geolocation
                    <span class="sidebar-close"><i class="fa fa-caret-left"></i></span>
                </h1>
                <label for="track">
                track position
                <input id="track" type="checkbox"/>
                </label>
                <p id="location_err" style="display: none;"></p>
            </div>
            <div class="sidebar-pane" id="settings">
                <h1 class="sidebar-header">Settings<span class="sidebar-close"><i class="fa fa-caret-left"></i></span></h1>
            </div>
        </div>
    </div>
    <div id="map" class="sidebar-map"></div>
    </div>
    <script type="text/javascript">
        var service_url = 'https://www.wondermap.it/cgi-bin/qgis_mapserv.fcgi?map=/home/umberto/qgis/projects/Demo_sci_WMS/demo_sci.qgs&';
    </script>
    <script src="dist/index.js"></script>
</body>
</html>

<?php
  }
  else {
      header("Location: ../index.php");
  }
?>
