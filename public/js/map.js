
mapboxgl.accessToken = 'pk.eyJ1IjoibmF2ZWVuc29uaSIsImEiOiJjbHVmcTRzN2owbmZyMmpyb3dpM3pzam91In0.dJbzgg93yRFTxZK2Ya4njw';
  const map = new mapboxgl.Map({
      container: 'map', // container ID
      // Choose from Mapbox's core styles, or make your own style with Mapbox Studio
      style: 'mapbox://styles/mapbox/streets-v12', // style URL
      center: coordinates, // starting position [lng, lat]
      zoom: 9 // starting zoom
  });

  {/* const layerList = document.getElementById('menu');
  const inputs = layerList.getElementsByTagName('input');

  for (const input of inputs) {
      input.onclick = (layer) => {
          const layerId = layer.target.id;
          map.setStyle('mapbox://styles/mapbox/' + layerId);
      };
  } */}
    
  const marker=new mapboxgl.Marker({color:'red'})
  .setLngLat(coordinates)
//  .setPopup(new mapboxgl.Popup({offset:25}))
 // .setHTML("<h1>Hello World!</h1>")
  .addTo(map);
  
  