import React, { useRef, forwardRef, useState } from "react";
import Axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaCalendarAlt } from "react-icons/fa";
import emailjs from '@emailjs/browser';

const Costuminput = forwardRef(({ value, onClick }, ref) => {
  return (
    <div className="input-group">
      <input
        type="text"
        className="form-control"
        value={value}
        onClick={onClick}
        readOnly
        ref={ref}
      />
      <div className="input-group-append" onClick={onClick}>
        <span className="input-group-text">
          <FaCalendarAlt />
        </span>
      </div>
    </div>
  );
});

function App() {
  const [selecthours, setSelecthours] = useState([]);
  const [heuredispo, setHeuredispo] = useState([]);
  const [day, setDay] = useState("1");
  const [month, setMonth] = useState("1");
  const [year, setYear] = useState("2024");
  const [selectedDate, setSelectedDate] = useState("");
  const [showReservationForm, setShowReservationForm] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const form = useRef(null);

  const [nom, setNom] = useState("");
const [prenom, setPrenom] = useState("");
const [phone, setPhone] = useState("");


  const currentDate = new Date();
  const currentDay = currentDate.getDate();
  const currentMonth = currentDate.getMonth() + 1;
  const currentYear = currentDate.getFullYear();

  const reservationReussiePopup = () => {
    window.alert("La réservation a été réussie !");
  };

  const isDateValid1 =
    parseInt(year, 10) > currentYear ||
    (parseInt(year, 10) === currentYear &&
      parseInt(month, 10) > currentMonth) ||
    (parseInt(year, 10) === currentYear &&
      parseInt(month, 10) === currentMonth &&
      parseInt(day, 10) >= currentDay);

      const handleHoursChange = (e) => {
        // Utilisez la propriété "selectedOptions" pour obtenir les options sélectionnées
        const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
        setSelecthours(selectedOptions);
      };

  const handleDateChange = (date) => {
    setSelectedDate(date);

    const dateObject = new Date(date);
    const day = dateObject.getDate();
    const month = dateObject.getMonth() + 1;
    const year = dateObject.getFullYear();
    setDay(day);
    setMonth(month);
    setYear(year);
  };

// ...

const sendEmail = (e) => {
  e.preventDefault();

  emailjs.sendForm('service_cgpjx46', 'template_gv2scgf', form.current, 'dkQagEfXrOwdjH6TO')
    .then((result) => {
        console.log("envoyé avec succés");
    }, (error) => {
        console.log(error.text);
    });
};

const disponible = () => {
  Axios.post("https://ks-immo-back-d1i33fm31-ifeks.vercel.app/disponible", {
    selectedDay: day,
    selectedMonth: month,
    selectedYear: year,
  })
    .then((response) => {
      console.log(response.data);
      setHeuredispo(response.data);
    })
    .catch((error) => {
      console.error(
        "Erreur lors de la vérification de la disponibilité de la date :",
        error
      );
    });
};

const actualiserdispo = () => {
  Axios.post("https://ks-immo-back-d1i33fm31-ifeks.vercel.app/actualiserdispo", {
    selectedDay: day,
    selectedMonth: month,
    selectedYear: year,
    heuredispo: selecthours
  })
    .then(() => {
      reservationReussiePopup(); // Afficher la popup lors de la réussite de la réservation
      setShowReservationForm(false);
      setName("");
      setEmail("");
    })
    .catch((error) => {
      console.error(
        "Erreur lors de la vérification de la disponibilité de la date :",
        error
      );
    });
};

// ...


  // const handleSubmit = (e) => {
  //   e.preventDefault();
    
  //   setShowReservationForm(false);
  //   setName("");
  //   setEmail("");
  // };

  return (
    <div className="App">
      <div className="employees">
        <div className="dates-container">
          <h2>Choisissez la date de reservation ?</h2>
          <DatePicker
            selected={selectedDate}
            onChange={handleDateChange}
            customInput={<Costuminput value={selectedDate} onClick={handleDateChange} />}
          />
          {console.log(isDateValid1)}
          {selectedDate && !isDateValid1 && (
          <p style={{color:'red'}}>Veuillez choisir une date supérieure à la date actuelle.</p>
        )}
          {isDateValid1 && (
            <>
              <button onClick={disponible}>
                Voir les disponibilités d'heures
              </button>
              <h1>Les heures disponibles :</h1>
<select
  name="hours"
  id="hours-select"
  value={selecthours}  // Assurez-vous de définir la valeur correcte ici
  onChange={handleHoursChange}
  multiple  // Ajoutez l'attribut "multiple" pour permettre la sélection multiple
>
  {heuredispo &&
    heuredispo.map((val, index) => (
      <option key={index} value={val.heure}>
        {val.heure}
      </option>
    ))}
</select>
              <button onClick={() => setShowReservationForm(true)}>
                Réserver
              </button>
              {showReservationForm && (
                <div style={{ width: "50%", margin: "auto" }}>
                  <h2>Formulaire de Réservation</h2>
                  <form ref={form} onSubmit={sendEmail}>
                    <label htmlFor="name">Date de reservation:</label>
                    <input
                      type="text"
                      name="date"
                      value={`${month}/${day}/${year}  :  ${selecthours}`}
                      readOnly
                    />
                    <br></br>
                    <label htmlFor="nom">Votre nom:</label>
                    <input
                      type="text"
                      name="nom"
                      id="nom"
                      value={nom}
                      onChange={(e) => setNom(e.target.value)}
                    />
                    <br></br>
                    <label htmlFor="prenom">Votre prénom:</label>
                    <input
                      type="text"
                      name="prenom"
                      id="prenom"
                      value={prenom}
                      onChange={(e) => setPrenom(e.target.value)}
                    />
                    <br></br>
                    <br></br>
                    <label htmlFor="phone">Numéro de téléphone:</label>
                    <input
                      type="text"
                      name="phone"
                      id="phone"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                    <br></br>
                    <label htmlFor="email">Adresse e-mail:</label>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    <button onClick={actualiserdispo}>Valider la réservation</button>
                  </form>
                </div>
              )}
            </>
          )}
          <div className="dates"></div>
          <div></div>
        </div>
      </div>
    </div>
  );
}

export default App;
