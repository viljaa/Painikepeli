import React, {useState} from "react";

import './Rules.css'

const Rules = () =>{

    const [rulesVisible, setRulesVisible] = useState(false);

    const toggle = () =>{
        setRulesVisible(!rulesVisible)
    };

    return (
        <div id="rules_container">
            <button id="toggle_rules" onClick={toggle}>SÄÄNNÖT</button>
            {rulesVisible &&
                <div id="rules_content">
                    <div id="content_margin">
                    <h3 id="rules_h3">Pelin säännöt:</h3>
                    <p id="rules_p">1. Peliä pelataan klikkaamalla PLAY-nappulaa.</p>
                    <p id="rules_p">2. Pelaajalla on pelin alussa 20 pistettä, ja jokainen painallus maksaa pelaajalle 1 pisteen.</p>
                    <p id="rules_p">3. Pelaajan on mahdollista voittaa pelissä pisteitä painamalla PLAY-nappulaa
                    oikealla hetkellä. Pisteet jaetaan kierroslaskurin mukaan, joka on kaikille pelaajille yhteinen.</p>
                    <p id="rules_p">4. Jokainen pelaajien tekemä painallus lisää yhden kierroksen kierros- laskuriin 
                    jonka arvo on salainen. Kierroslaskurin arvo määrää jaetaanko pelaajalle pisteitä, 
                    ja jos jaetaan niin kuinka paljon.</p>
                    <p id="rules_p">5. Kierroslaskurin joka 10. painalluksella voittaa 5 pistettä, 
                    joka 100. painalluksella 40 pistettä ja joka 500. painallus 250 pistettä. </p>
                    <p id="rules_p">6. Yksi pelikierros kestää 3 minuuttia, jonka jälkeen pelaajien
                    pisteet ja kierroslaskuri nollaantuvat. Uusi pelikierros alkaa automaattisesti vanhan päätyttyä</p>
                    <p id="rules_p">7. Jos pelaajalta loppuvat pisteet, annetaan tälle mahdollisuus 
                    aloittaa alusta 20 pisteellä tai lopettaa pelaaminen.</p>
                    </div>
                </div>
            }
        </div>
    )
}

export default Rules;