import { useCallback, useEffect, useRef, useState } from "react";

import Places from "./components/Places.jsx";
import { AVAILABLE_PLACES } from "./data.js";
import Modal from "./components/Modal.jsx";
import DeleteConfirmation from "./components/DeleteConfirmation.jsx";
import logoImg from "./assets/logo.png";
import { sortPlacesByDistance } from "./loc.js";

// fetching picked places from the browser , and this piece of code will be fetched only once
// and since it synchronous it doesnt need  to inside the useEffect hook
const storageDataIds = JSON.parse(localStorage.getItem("selectedPlaces")) || [];

const storedPlaces = storageDataIds.map((id) =>
  AVAILABLE_PLACES.find((place) => place.id === id)
);

function App() {
  const selectedPlace = useRef();
  const [pickedPlaces, setPickedPlaces] = useState(storedPlaces);
  const [availablePlaces, setAvailablePlaces] = useState([]);
  //using useState hook to set modal state 
  const[modalIsOpen, setModalIsOpen] = useState(false);

  //Here we are using the using useEffect in order to handle the infiniteloop and getting the geolocation position
  // is async process it may or maynot be available with same execution time and could be available in future
  // so once the geoloction is fetched it will se the useState hook (here availablePlaces). Also once in the last
  // becoz the state of object will not be changed
  useEffect(() => { 
    navigator.geolocation.getCurrentPosition((position) => {
      const sortedAvailablePlaces = sortPlacesByDistance(
        AVAILABLE_PLACES,
        position.coords.latitude,
        position.coords.longitude
      );
      setAvailablePlaces(sortedAvailablePlaces);
    });
  }, []);

  function handleStartRemovePlace(id) {
    setModalIsOpen(true);
    selectedPlace.current = id;
  }

  function handleStopRemovePlace() {
       setModalIsOpen(false);
  }

  function handleSelectPlace(id) {
    setPickedPlaces((prevPickedPlaces) => {
      if (prevPickedPlaces.some((place) => place.id === id)) {
        return prevPickedPlaces;
      }
      const place = AVAILABLE_PLACES.find((place) => place.id === id);
      return [place, ...prevPickedPlaces];
    });

    //fetching data from browserstorage if available
    const storageDataIds =
      JSON.parse(localStorage.getItem("selectedPlaces")) || [];

    if (storageDataIds.indexOf(id) === -1) {
      //ignoring if same location is already available
      localStorage.setItem(
        "selectedPlaces",
        JSON.stringify([id, ...storageDataIds])
      );
    }
  }

  // useCallback(() => {}, [])

  const handleRemovePlace = useCallback(function handleRemovePlace() {
    setPickedPlaces((prevPickedPlaces) =>
      prevPickedPlaces.filter((place) => place.id !== selectedPlace.current)
    );
    setModalIsOpen(false);

    //fetching data from browserstorage if available
    const storageDataIds =
      JSON.parse(localStorage.getItem("selectedPlaces")) || [];
    // removing the selected places from localstorage
    localStorage.setItem(
      "selectedPlaces",
      JSON.stringify(
        storageDataIds.filter((id) => id !== selectedPlace.current)
      )
    );
  }, []);

  return (
    <>
      <Modal showModal={modalIsOpen} onclosing={handleStopRemovePlace}>
        <DeleteConfirmation
          onCancel={handleStopRemovePlace}
          onConfirm={handleRemovePlace}
        />
      </Modal>

      <header>
        <img src={logoImg} alt="Stylized globe" />
        <h1>PlacePicker</h1>
        <p>
          Create your personal collection of places you would like to visit or
          you have visited.
        </p>
      </header>
      <main>
        <Places
          title="I'd like to visit ..."
          fallbackText={"Select the places you would like to visit below."}
          places={pickedPlaces}
          onSelectPlace={handleStartRemovePlace}
        />
        <Places
          title="Available Places"
          fallbackText={"Fetching places based on your location."}
          places={availablePlaces}
          onSelectPlace={handleSelectPlace}
        />
      </main>
    </>
  );
}

export default App;
