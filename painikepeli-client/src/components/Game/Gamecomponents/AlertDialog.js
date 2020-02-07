import React, {useState} from 'react';
import {Link} from 'react-router-dom';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

const AlertDialog = ({socket}) => {

    const[open, setOpen] = useState(false);

    socket.on('noPoints', function(){
        setOpen(true);
    });

    //Action if user chooses not to keep playing
    const closeAD = () =>{
        socket.disconnect();
        setOpen(false);
    }

    //Action if user chooses to keep on playing
    const continueGame = () =>{
        socket.emit('resetStats', {
            points: 20
          });

        setOpen(false);
    }

    return(
        <div>
            <Dialog open={open}>
                <DialogTitle id="alert-dialog-description">{"Oho, pisteesi loppuivat!"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                    Haluatko aloittaa alusta ja jatkaa pelaamista?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={continueGame}>
                        Kyllä, haluan jatkaa!
                    </Button>
                    <Link to={`/End`}>
                        <Button onClick={closeAD}>
                            Ei, haluan lopettaa.
                        </Button>
                    </Link>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default AlertDialog