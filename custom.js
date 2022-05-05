// JavaScript for enabling the map on load. Change the access token and the web page.

mapboxgl.accessToken = 'pk.eyJ1IjoibmlzaHRoYWRhcyIsImEiOiJjbDF3NXd0NzcxNXN6M2lxdmZ5ZTlibHg4In0.yzzogggdKJ1aNaST6hbUcg';

//Set the initial map view
const map = new mapboxgl.Map({
  container: 'map', // container ID
  style: 'mapbox://styles/ilamanish/cl2r6nsvb000c14p1x9wtvzwh', // style URL
  center: [77.0688997, 20.5272803], // starting position [lng, lat]
  zoom: 4, // starting zoom
  bearing: 0, //controls the left-right rotation of the map in degrees
  pitch: 0 //controls the up-down rotation of the map.
});

//This is all the stuff that runs on the first load of the map.
map.on('load', () => {
  //Hide all presentation layers
  //This demo uses three specific layers. I want to hide them initially so I can reveal them piece meal.
  map.setLayoutProperty('author-location-text-title', 'visibility', 'none');
  map.setLayoutProperty('temporality-count', 'visibility', 'none');
  map.setLayoutProperty('religion-by-location', 'visibility', 'none');

//Hide the legend, slider, and infobox on first load. Obviously delete these lines if you want them visible from the start.
document.getElementById('legend').style.display = 'none';
document.getElementById('console').style.display = 'none';
document.getElementById('infobox').style.display = 'none';

  //to reduce clutter, the steps for creating a legend, slider, and menu have all been turned into functions.
  createLegend()
  createSlider()
  createMenu()

});

function createMenu(){

    // MENU For selecting layers
    // Read in all the layers you want to toggle
    var toggleableLayerIds = ['religion-by-location', 'author-location-text-title', 'temporality-count'];

    //These are the names for the layers that will appear on the menu
    var layerNames = ['Legend: Religion by Location', 'Infobox: Text Titles', 'Slider: Temporality']

    //Loop that generates a menu item for each layer in the above array.
    for (var i = 0; i < toggleableLayerIds.length; i++) {
      var id = toggleableLayerIds[i];
      var name = layerNames[i];
      var link = document.createElement('a');
      link.href = '#';
      link.className = ''; //Menu initially sets every item as inactive.
      link.textContent = name;
      link.id = id;

      //create an event handler for each menu item. If clicked check whether the layer is visible, if so set visibility to 'none' and vice versa.
      link.onclick = function(e) {
        var clickedLayer = this.id;
        e.preventDefault();
        e.stopPropagation();

        var visibility = map.getLayoutProperty(clickedLayer, 'visibility');

        if (visibility === 'visible') {
          map.setLayoutProperty(clickedLayer, 'visibility', 'none');
          this.className = '';

        } else {
          this.className = 'active';
          map.setLayoutProperty(clickedLayer, 'visibility', 'visible');
        }
      };
      var layers = document.getElementById('menu');
      layers.appendChild(link);
    }

}


//This is a lazy function to hide and show menus relative to the layers. It waits for any change in the map rendering and then checks to see what menu items are active and turns on the infobox, slider, and legend. Normally, you would build this logic into the click event handler for each button.

map.on('idle', () => {

  var toggleableLayerIds = ['religion-by-location', 'author-location-text-title', 'temporality-count'];

  for (var i = 0; i < toggleableLayerIds.length; i++) {
    var id = toggleableLayerIds[i];
    var visibility = map.getLayoutProperty(id, 'visibility');

    if (id == 'religion-by-location' && visibility === 'none') {
      document.getElementById('legend').style.display = 'none';
    } else if (id == 'religion-by-location' && visibility === 'visible') {
      document.getElementById('legend').style.display = 'initial';
    }
    if (id == 'temporality-count' && visibility === 'none') {
      document.getElementById('console').style.display = 'none';
    } else if (id == 'temporality-count' && visibility === 'visible') {
      document.getElementById('console').style.display = 'initial';
    }
    if (id == 'author-location-text-title' && visibility === 'none') {
      document.getElementById('infobox').style.display = 'none';
    } else if (id == 'author-location-text-title' && visibility === 'visible') {
      document.getElementById('infobox').style.display = 'initial';
    }
  }
});

//Event handler for the infobox. This checks where the mouse is when it moves. If it moves over an area where the layer it populates the info box.
map.on('mousemove', function(e) {

  //START INFOBOX CODE =======================================================

  //CONTEXT--------------------------------------------------------
  //The infobox is "triggered" by the mousemove function. That is, when your mouse moves over a certain area the function activates. It then pulls information from the layer in order to display it.  The two things you we will set here are the layer you are pulling information and the information you are going to display.

  //CONTEXT-------------------------------------------------
  // This makes a temporary version of the layer from which we will pull data based on the area the mouse cursor is pointing over (e.point). So if we are hovering over Delhi it will pull up the information on Delhi. In order to be able to do this the computer needs to know where to find this information. In this case, the layer is 'author-location-text-title'. Just so the script grabs the most up to date layer please publish your project. Now go to mapbox figure out what layer you want info for and copy the name exactly and replace 'author-location-text-title'.

  //MAKE CHANGE-----------------------------------------------------------------
  var info = map.queryRenderedFeatures(e.point, {
    layers: ['author-location-text-title'] //REPLACE 'author-location-text-title' with the name of your layer
    //of your layer
  });

  //CONTEXT -----------------------------------------------------------------
  //The code below looks a bit overwhelming! Essentially, what we will be doing is telling the computer what information about what features we want to display. The code below produces the name of the author, the name of the story, the name of the location, and the count. It also adds a picture of the book cover.
  //Since, these values are going to change depending on where I scroll I want to get these pieces of information based on variables and not absolute values. I do this by looking at the Info variable I created earlier. Since, this variable contains all the values of the area my mouse is currently over, I can display whatever values I want. I access these values by saying   info[0].properties.author_name. That is, give me the current value of the author_name column. Whatever attributes are part of the layer can be accessed. So really, the only thing you are changing here is the value after the properties. to match with what you want to show.
  //You'll also notice that there are pieces in double quotes like "Name: ". This is constant and Name: will always show on a scroll over. You'll note that this text is connected with the variable info[0].properties.author_name through a plus sign ( + ). If computers want to add text together they need to concatenate.
  //If I write "Programming " + "is " + "fun.", the output will be Programming is fun. Thus if you want to change the labels of the text before the variable this is what you change.

  //For the images I did a simple workaround. I want to display the image of the text for each author, but I do not necessarily have each the title of each work as some are short stories. Instead, saved a picture of each author's work and saved it by their name (i.e. Sikdar, Sunanda.jpg). Thus, whenever an author's name comes up from the properties, it merely has to look for that image name to match.



  //MAKE CHANGE---------------------------------------------------------------
  if (info.length > 0) {
    var image = 'images/' + info[0].properties.author_name + '.jpg'
    //i.e. image = images/Sikdar,Sunanda.jpg
    var formatted_image = '<center>' + '<img width=90% src="' + image + '"/>' + '</center>'

    document.getElementById('infobox_content').innerHTML = '<h5>' + "Name: " + info[0].properties.author_name + '</h5>' + formatted_image +
      '<p>' + "Text title: " + info[0].properties.text_title + '</p><p>' + "Location name: " + info[0].properties.location_name + '</p>' + '<p>' + "Frequency: " + info[0].properties.Count +
      '</p>';
    //Depending on what you want to show you can add more variables and more text The stub above generates the author_name, text_title, the location_name and the frequency count.

  } else {
    document.getElementById('infobox_content').innerHTML = '<p>Hover over an area</p>';
  }
});


function createLegend() {
  //LEGEND TEXT
  //the var layers array sets the text that will show up in the legend. you can enter any value here it is just text. Make sure that the legend values correspond to the ones you set in Mapbox.
  var layers = ['Hindu', 'Muslim', 'Sikh', 'Other'];

  //LEGEND COLORS
  //Set the corresponding LEGEND colors using HEX the easiest way to do this is by setting your mapcolors in Mapbox using ColorBrewer (colorbrewer2.org). Then copy the exact same hex value to the array below. Remember that each label above should correspond to a color. If the number of items in layers does not match the number of values in colors you will get an error.


  var colors = ['#321881', '#f88d1b', '#f7368a', '#0ac213'];

//run through each element in the legend array and create a new legend item.
  for (i = 0; i < layers.length; i++) {
    var layer = layers[i];
    var color = colors[i];
    var item = document.createElement('div');
    var key = document.createElement('span');
    key.className = 'legend-key';
    key.style.backgroundColor = color;

    var value = document.createElement('span');
    value.innerHTML = layer;
    item.appendChild(key);
    item.appendChild(value);
    legend.appendChild(item);
  }
  //LEGEND CODE


}

function createSlider() {
  //Set the initial view at the first value. In this case, 1 for Pre-Partition.
  map.setFilter('temporality-count', ['==', ['number', ['get', 'temporal_sequence']], 1]);
  document.getElementById('active-temporality').innerText = 'Pre-Partition (before 1947-08-14)'
  map.setLayoutProperty('temporality-count', 'visibility', 'none')

  //Create event listener to catch whenever the slider is moved.
  document.getElementById('slider').addEventListener('input', function(e) {
    //get the value of the movement.
    var step = parseInt(e.target.value, 10);

    //These labels were created to populate the active temporality label. Change them if you are going with your own string sequence.
    var label = ['Pre-Partition (before 1947-08-14)',
      'Partition (1947-08-15 - 1948-02-28)',
      'Post-Partition (1948-03-01 - 1971-12-16)',
      'Long Partition (after 1971-12-16)',
      'Indeterminable'
    ]

    //This is the filter function, it relies on the layer name, the comparison operator (==), the first value which it grabs with the get, temporal sequence function, and then the thing being compared against (step), or the step in the sequence of the slider.

    map.setFilter('temporality-count', ['==', ['number', ['get', 'temporal_sequence']], step]);
    //This sets the label above the slider to the period value.
    document.getElementById('active-temporality').innerText = label[step - 1] //+ ampm;
  })
}
