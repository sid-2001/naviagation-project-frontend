import React, {useState, useEffect} from 'react';
import axios from "axios";

import { Div, Container, Button, Icon, Notification} from "atomize";

import './Home.css'

function Home (){

	const [poi, setPoi] = useState([]);
	const [src, setSrc] = useState('0');
  const [dest, setDest] = useState('0');
  const [path, setPath] = useState([]);
  const [coords, setCoords] = useState([]);
  const [showImage, setShowImage] = useState(false);
  const [sameNotif, setSameNotif] = useState(false)
  const [pathCount, setPathCount] = useState(0)
  const [splash, setSplash] = useState(true)
  const [mapUrl, setMapUrl] = useState(true)

  // Using useEffect for single rendering
  useEffect(() => {
      // Using fetch to fetch the api from 
      // flask server it will be redirected to proxy
      axios.get("/data").then((res) =>{
          setPoi(res.data.poi);
      });

  }, []);

  useEffect(() => {
      //do operation on state change
      if (showImage){
        var orgx = coords[1]-150
        var orgy = coords[0]-150

        document.getElementById('map').scrollTo(orgy, orgx)
      }
  },[coords, showImage])

  const handleSrcChange = (event) => {
    setSrc(event.target.value);
  };

  const handleDestChange = (event) => {
    setDest(event.target.value);
  };

  const submitInfo = () => {

    if (src===dest){
      setSameNotif(true)
      return
    }

    const data = {
      "src": src,
      "dest": dest
    }

    axios.post("/generatePath", data).then((res) =>{
      setPath(res.data.path)
      setCoords(res.data.coords)
      setShowImage(true)
    }).catch(() => {
      setMapUrl(false)
    })
  }

  const moveForward = () => {

    if(pathCount >= path.length-1){
      return
    }
    setPathCount(pathCount+1);

    var orgx = coords[2*(pathCount+2)-1]-150
    var orgy = coords[2*(pathCount+2)-2]-150

    document.getElementById('map').scrollTo(orgy, orgx)
  }

  const moveBackward = () => {
    if(pathCount <= 0){
      return
    }
    setPathCount(pathCount-1);

    var orgx = coords[2*(pathCount+1)-1]-150
    var orgy = coords[2*(pathCount+1)-2]-150

    document.getElementById('map').scrollTo(orgy, orgx)
  }
  

  return (
    <>
    {splash ? <Container h="100vh" onClick={() => setSplash(false)}>
      <div class="splash-logo">
        <img src="/splash.png" alt="splash" />
      </div>
    </Container> : 
    
      <Container h="100vh" class="main">

          { showImage ? <Div></Div> : 

          <Div p={{ t: '2rem'}} textColor="white">
          <img src="/back.png" alt="back" class="back-icon" onClick={() => setMapUrl(true)}/>
          <img src="/switch.png" alt="switch" class="switch-icon"/>
          <form method= "POST" encType="multipart/form-data" class="form-container">
              <div className = "file_input">
              	<label>
                  <div className="select">
                  <select value={src} onChange={handleSrcChange}>
                    <option value="" selected>Current Location</option>
                    {poi.map((option) => (
                      
                      <option value={option}>{option}</option>

                    ))}

                  </select>
                  </div>

                </label> <br/>

                <label>
                  <div className="select">
                    <select value={dest} onChange={handleDestChange}>
                      <option value="" selected>Choose Store to Visit</option>
                      {poi.map((option) => (

                        <option value={option}>{option}</option>

                      ))}

                    </select>
                  </div>

                </label>
              </div>
              <Div textAlign="center">
                <Button
                  type="button"
                  suffix={
                    <Icon
                      name="LongRight"
                      size="16px"
                      color="white"
                      m={{ l: "1rem" }}
                    />
                  }
                  shadow="3"
                  hoverShadow="4"
                  m={{ x: 'auto', t: '2rem'}}
                  onClick={submitInfo}
                  textAlign="center"
                >
                  Submit
                </Button>
              </Div>
          </form>
          {mapUrl ? <div id='map2'>
              <img src='./test.png' alt="shortest path" />
          </div> : <div class='no-results'>
              <img src='./none.png' alt="shortest path" />
              No results found for the search
          </div>}
          
          </Div> }
          <br/>
          { showImage ?
          <Div pos="relative" class="main">
            <div class="form-container">
            <img src="/back.png" alt="back" class="back-icon" onClick={() => setShowImage(false)}/>
              {src}  - {dest}
            <img src="/compass.png" alt="back" class="compass-icon"/>
            </div>
            <div id='map'>
              <img src={"data:image/png;base64, "+path[pathCount]} alt="shortest path" />
            </div>

            <div className='meta-popup'>
              <div class="meta-container">
                <div class="meta-item">
                <img src="/walk.png" alt="back" class="back-icon"/>
                Walk Straight 3 min (103m)
                </div>
              </div>

              <hr className='dotted'/>
              <div class="meta-container">
                <div class="meta-item">
                <img src="/man.png" alt="back" class="back-icon"/>
                19m
                <div>
                <button class="step-button" onClick={moveBackward}> &lt; Previous Step </button>
                <button class="step-button" onClick={moveForward}>Next Step &gt; </button>
                </div>
                
                </div>
              </div>

              <hr className='dotted'/>
              <div class="meta-container">
                <div class="meta-item">
                <img src="/haldiram.png" alt="back" class="back-icon"/>
                <div class="shop-info">
                Haldiram’s
                <p>Shop number: C41/C42/C43</p>
                <p> Level: Lower Ground Floor Zone</p>
                </div>
                
                </div>
              </div>
            </div>
            
            
            <br/>
          
          </Div> : <Div></Div> }

        
        <Notification
          bg="danger700"
          isOpen={sameNotif}
          onClose={() => setSameNotif(false)}
          prefix={
            <Icon
              name="CloseSolid"
              color="white"
              size="18px"
              m={{ r: "0.5rem" }}
            />
          }
        >
          Source and Destination cannot be the same.
        </Notification>
       
      </Container> }
    </>

  )
}
  
export default Home;