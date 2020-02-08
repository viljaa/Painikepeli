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
                    <pre id="rules_pre">{`
1. Peliä pelataan klikkaamalla PLAY-
   nappulaa.

2. Pelaajalla on pelin alussa 20 
   pistettä, ja jokainen painallus
   maksaa pelaajalle yhden pisteen.

3. Pelaajan on mahdollista voittaa
   pelissä pisteitä painamalla PLAY-
   nappulaa oikealla hetkellä. Pisteet
   jaetaan kierroslaskurin mukaan, joka
   on kaikille pelaajille yhteinen.

4. Jokainen pelaajien tekemä painallus
   lisää yhden kierroksen kierrolasku-
   riin jonka arvo on salainen. Kier-
   roslaskurin arvo määrää jaetaanko
   pelaajalle pisteitä, sekä kuinka
   paljon pisteitä jaetaan.

5. Kierroslaskurin joka 10. painal-
   luksella voittaa 5 pistettä, joka
   100. painalluksella 40 pistettä ja
   joka 500. painallus 250 pistettä.

6. Yksi pelikierros kestää 3 minuuttia,
   jonka jälkeen pelaajien pisteet ja
   kierroslaskuri nollaantuvat. Uusi
   pelikierros alkaa automaattisesti
   vanhan päätyttyä.

7. Jos pelaajalta loppuvat pisteet,
   annetaan tälle mahdollisuus aloittaa
   alusta 20 pisteellä tai lopettaa
   pelaaminen.
                    `}</pre>
                    </div>
                </div>
            }
        </div>
    )
}

export default Rules;