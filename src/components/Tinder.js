
import '../App.css';
import React, {useEffect, useMemo, useState} from 'react';
import TinderCard from 'react-tinder-card';
import IconButton from '@material-ui/core/IconButton';
import WhatshotIcon from '@material-ui/icons/Whatshot';
import CancelIcon from '@material-ui/icons/Cancel';
import { makeStyles } from '@material-ui/core/styles';
import * as firebase from "firebase";
import { useHistory } from 'react-router';
import firebaseConfig from '../config/firebase.config';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const useStyles = makeStyles((theme) => ({
  WhatshotIcon: {
    '& svg': {
      fontSize: 50,
      color: '#fff'
    }
  },
  WhatshotIconSmall: {
    '& svg': {
      fontSize: 20,
      color: '#fff'
    }
  },
}));

const db = [
  {
    name: 'Richard Hendricks',
    url: './img/richard.jpg'
  },
  {
    name: 'Erlich Bachman',
    url: './img/erlich.jpg'
  },
  {
    name: 'Monica Hall',
    url: './img/monica.jpg'
  },
  {
    name: 'Jared Dunn',
    url: './img/jared.jpg'
  },
  {
    name: 'Dinesh Chugtai',
    url: './img/dinesh.jpg'
  }
]

const alreadyRemoved = []
let charactersState = db 

function Dashboard() {

    function onClick() {
        setTimeout(
            function() {
                try {
                    firebase.auth().signOut();
                    history.push('/');
                } 
                catch (e) {
                    console.log(e);
                }
            }, 1000);
    }

    const history = useHistory();
    useEffect(() => {
        firebase.auth().onAuthStateChanged(user => {
        history.push(user ? '/dashboard' : '/');
        })
    }, []);

    const [characters, setCharacters] = useState(db)
    const [lastDirection, setLastDirection] = useState()

    const childRefs = useMemo(() => Array(db.length).fill(0).map(i => React.createRef()), [])
    const classes = useStyles();
    
    const swiped = (direction, nameToDelete) => {
        console.log('removing: ' + nameToDelete)
        setLastDirection(direction)
        alreadyRemoved.push(nameToDelete)
    }

    const outOfFrame = (name) => {
        console.log(name + ' left the screen!')
        charactersState = charactersState.filter(character => character.name !== name)
        setCharacters(charactersState)
    }

    const swipe = (dir) => {
        const cardsLeft = characters.filter(person => !alreadyRemoved.includes(person.name))
        if (cardsLeft.length) {
        const toBeRemoved = cardsLeft[cardsLeft.length - 1].name // Find the card object to be removed
        const index = db.map(person => person.name).indexOf(toBeRemoved) // Find the index of which to make the reference to
        alreadyRemoved.push(toBeRemoved) // Make sure the next card gets removed next time if this card do not have time to exit the screen
        childRefs[index].current.swipe(dir) // Swipe the card!
        }
    }

    return (
        <div className="App">
        <header className="App-header">
            <IconButton className={classes.WhatshotIcon}>
                <WhatshotIcon />
            </IconButton>
            <div className="buttons">
                <IconButton onClick={onClick}>
                    <ExitToAppIcon/>
                </IconButton>
            </div>
            <div className='cardContainer'>
            {characters.map((character, index) =>
                <TinderCard ref={childRefs[index]} className='swipe' key={character.name} onSwipe={(dir) => swiped(dir, character.name)} onCardLeftScreen={() => outOfFrame(character.name)}>
                <div style={{ backgroundImage: 'url(' + character.url + ')' }} className='card'>
                    <h5>{character.name}</h5>
                </div>
                </TinderCard>
            )}
            </div>
            <div className='buttons'>
                <IconButton onClick={() => swipe('left')}>
                    <CancelIcon/>
                </IconButton>
                <IconButton onClick={() => swipe('right')}>
                    <WhatshotIcon ></WhatshotIcon>
                </IconButton>
            </div>
        
        </header>
        </div>
    );
}

export default Dashboard;
