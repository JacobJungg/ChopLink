import React from "react";
import { isWebUri } from 'valid-url';
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import { nanoid } from 'nanoid'
import { getDatabase, child, ref, set, get } from "firebase/database";

class Form extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            //Store long url
            longURL: '',
            //Stores user inputs as their prefered
            preferedAlias: '',
            //Stores the url we generate
            generatedURL: '',
            //Show spinner when true
            loading: false,
            //Which feild on form have errors
            errors: [],
            //Keep track of errors
            errorMessage: {},
            toolTipMessage: 'Copy To Clip Board'
        };

    }

    //User clicks submit
    onSubmit = async (event) => {
        //Stop page from reloading
        event.preventDefault(); 
        this.setState({
            //User clicked true
            loading: true,
            //So we dont use old url
            generatedURL: ''
        })

        //Checks input from user
        var isFormValid = await this.validateInput()
        //Calls true or false, if false go in here
        if (!isFormValid) {
            return
        }

        //Calls five charachters
        //36^5 = 60466176
        var generatedKey = nanoid(5);

        //Append url with generated key (nanoid letters)
        var generatedURL = "choplink.com/" + generatedKey

        if (this.state.preferedAlias !== '') {
            //If the user has an alias they inputted
            generatedKey = this.state.preferedAlias
            //Appends url with alias
            generatedURL = "choplink.com/" + this.state.preferedAlias
        }

        //Creating reference to firebase
        const db = getDatabase();
        //Call set method, path we want to write using the generate key
        //Writes in all data to database
        set(ref(db, '/' + generatedKey), {

            generatedKey: generatedKey,
            longURL: this.state.longURL,
            preferedAlias: this.state.preferedAlias,
            generatedURL: generatedURL

        }).then((result) => {
            this.setState({

                //Sets state so the generated url is the one we created
                generatedURL: generatedURL,
                //Stops loading
                loading: false
            })
        }).catch((e) => {

        })
    };


//HELPER FUNCTIONS

    //If the key fails, is it in errors array
    hasError = (key) => {
        return this.state.errors.indexOf(key) !== -1;
    }


    //Called each time the user types into the input feild
    //Sets state of id and value to whatever is typed
    handleChange = (e) => {
        const { id, value } = e.target
        this.setState(prevState => ({
            ...prevState,
            [id]: value
        }))
    }


    //Goes through form and makes sure everything loojs good
    validateInput = async () => {
        //Initialize error
        var errors = [];
        //Whatever error are there are cleared
        var errorMessages = this.state.errorMessage

        //Checks long url
        //If no url is entered length is 0
        if (this.state.longURL.length === 0) {
            errors.push("longURL");
            errorMessages['longURL'] = 'Please enter your URL!';
        } else if (!isWebUri(this.state.longURL)) {
            //If not a proper url
            errors.push("longURL");
            errorMessages['longURL'] = 'Please a URL in the form of https://www....';
        }

        //If user has inputed a prefered alias
        if (this.state.preferedAlias !== '') {
            //If its longer than 5
            if (this.state.preferedAlias.length > 5) {
                errors.push("suggestedAlias");
                errorMessages['suggestedAlias'] = 'Please Enter an Alias less than 6 Characters';
            } else if (this.state.preferedAlias.indexOf(' ') >= 0) {
                errors.push("suggestedAlias");
                errorMessages['suggestedAlias'] = 'Only alphabetical charachters are allowed';
            }
            
            //Checks if url already exists in data base
            var keyExists = await this.checkKeyExists()

            
            if (keyExists.exists()) {
                errors.push("suggestedAlias");
                errorMessages['suggestedAlias'] = 'This alias already exists';
            }
        }

        this.setState({
            errors: errors,
            errorMessages: errorMessages,
            loading: false
        });

        //If errors are found
        if (errors.length > 0) {
            return false;
        }

        return true;
    }

    //Fetch record of alias the user has said they want to use
    checkKeyExists = async () => {
        const dbRef = ref(getDatabase());
        return get(child(dbRef, `/${this.state.preferedAlias}`)).catch((error) => {
            return false
        });
    }

    //Copies generated url to copy
    copyToClipBoard = () => {
        navigator.clipboard.writeText(this.state.generatedURL)
        this.setState({
            toolTipMessage: 'Copied'
        })
    }


    render() {
        return (

            //Container
            <div className="container">
            <img
                src="ChopLink Logo.png"
                className="top-left-image"
                //Width image
                width="40"
                style={{

                    //Relative to container
                    position: "relative",
                    //Distance top
                    top: "-15px",
                    //Distance left
                    left: "-40px",
                }}
            />
            <form autoComplete="off"></form>
                {/*Title*/}
                <form autoComplete="off">
                    <h3>ChopLink</h3>

                    {/*First sub title*/}
                    <div className="form-group text-center">
                        <label>Original URL</label>
                        
                        {/*First input feild*/}
                        <input
                            id="longURL"
                            onChange={this.handleChange}
                            //Value of url
                            value={this.state.longURL}
                            type="url"
                            required
                            //If the error array has an error show form is invalid
                            className={
                                this.hasError("longURL")
                                    ? "form-control is-invalid"
                                    : "form-control"
                            }
                            //Placeholder for first input feild
                            placeholder="https://www..."
                        />
                    </div>
                    <div
                    
                        //Only shows if there is an error
                        className={
                            this.hasError("longURL") ? "text-danger" : "visually-hidden"
                        }
                    >
                        {this.state.errorMessage.longURL}
                    </div>
                    
                    {/*Second sub title*/}
                    <div className="form-group text-center">
                        <label htmlFor="basic-url">Edit URL</label>
                        <div className="input-group mb-3">

                            {/*Block on left*/}
                            <div className="input-group-prepend">
                                <span className="input-group-text">choplink.com/</span>
                            </div>

                            {/*Block on rught*/}
                            <input
                                id="preferedAlias"
                                onChange={this.handleChange}
                                value={this.state.preferedAlias}
                                className={
                                    this.hasError("preferedAlias")
                                        ? "form-control is-invalid"
                                        : "form-control"
                                }
                                //Placeholder
                                type="text" placeholder="Eg. j4co8 (Optional)"
                            />
                        </div>
                        <div
                            className={
                                this.hasError("suggestedAlias") ? "text-danger" : "visually-hidden"
                            }
                        >
                            {this.state.errorMessage.suggestedAlias}
                        </div>
                    </div>

                    
                    {/*Button*/}
                    <div className="form-group text-center">
                    <button className="btn btn-primary" type="button" onClick={this.onSubmit}>
                        {
                        this.state.loading ?
                        <div>
                            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                        </div> :
                        <div>
                            <span className="visually-hidden spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                            <span>Submit</span>
                        </div>
                        }
                    </button>
                    </div>

                        
                    {   //If there is no generated url show empty div
                        this.state.generatedURL === '' ?
                            <div></div>
                            :

                            //If there is a generated url show
                            <div className="generatedurl">
                                <span>Your generated URL is: </span>
                                <div className="input-group mb-3"> 
                                {/*Disable input feild*/}
                                    <input disabled type="text" value={this.state.generatedURL} className="form-control" placeholder="Recipient's username" aria-label="Recipient's username" aria-describedby="basic-addon2" />
                                    <div className="input-group-append">
                                        
                                        
                                        {/*Tool tip*/}
                                        <OverlayTrigger
                                            key={'top'}
                                            placement={'top'}
                                            overlay={

                                                //Calls copy to clipboard method
                                                <Tooltip id={`tooltip-${'top'}`}>
                                                    {this.state.toolTipMessage}
                                                </Tooltip>
                                            }
                                        >
                                            <button onClick={() => this.copyToClipBoard()} data-toggle="tooltip" data-placement="top" title="Tooltip on top" className="btn btn-outline-secondary" type="button">Copy</button>

                                        </OverlayTrigger>

                                    </div>
                                </div>
                            </div>
                    }

                </form>


                {/* LinkedIn link outside the container, in the bottom right corner */}
                <a
                    href="https://www.linkedin.com/in/jacobjung8/"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                        position: "fixed",
                        bottom: "10px",
                        right: "10px",
                        borderRadius: "50%", // Make the button circular
                        background: "#007ebb", // Add a background color if needed
                        padding: "10px", // Adjust the padding as needed
                    }}
                >
                    <img
                        src="Linkdn Logo.png"
                        alt="LinkedIn Logo"
                        width="40"
                    />
                </a>
            </div>
        );
    }
}

//Export form
export default Form;