
import './App.css';
import React, { useEffect, Component} from 'react';
import IconButton from '@material-ui/core/IconButton';
import WhatshotIcon from '@material-ui/icons/Whatshot';
import LockOpenIcon from '@material-ui/icons/LockOpen';
import { makeStyles } from '@material-ui/core/styles';
import * as firebase from "firebase";
import { BrowserRouter, Route,Switch} from 'react-router-dom';
import { useHistory } from 'react-router';
import firebaseConfig from './config/firebase.config';
import Dashboard from './components/Tinder';

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

function App() {
  const history = useHistory();
  const classes = useStyles();
  useEffect(() => {
    firebase.auth().onAuthStateChanged(user => {
      history.push(user ? '/dashboard' : '/');
    })
  }, []);

  function onClickGoogle() {
    var provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider).then(function(result) {
      // ...
    }).catch(function(error) {
      // ...
    });
  }
  return (
    <div className="App">
      <header className="App-header">
      <IconButton className={classes.WhatshotIcon}>
        <WhatshotIcon />
      </IconButton>
      <div className='buttons'>
        <IconButton className="buttons" onClick={onClickGoogle}>
              <LockOpenIcon />
        </IconButton>
      </div>
      </header>
    </div>
  );
}

class Stack extends Component{
  render () {
    return (
      <BrowserRouter>
          <Switch>
            <Route exact={true} path="/" component={App} />
            <Route exact={true} path="/dashboard" component={Dashboard} />
          </Switch>
     </BrowserRouter>
    );
  }
}

export default Stack;