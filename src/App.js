import React, {Component} from 'react'
import './App.css'

import { auth, createUserProfileDocument, signInWithGoogle } from './firebase/firebase.utils'

class App extends Component {

  state = {
    currentUser: null,
  }

  unsubscribeFromAuth = null

  componentDidMount() {
    this.unsubscribeFromAuth = auth.onAuthStateChanged(async userAuth => {
      if(userAuth) {
        const userRef = await createUserProfileDocument(userAuth)

        userRef.onSnapshot(snapShot => {
          this.setState({
            currentUser: {
              id: snapShot.id,
              ...snapShot.data()
            }
          })
          console.log(this.state)
        })
        
      } else {
        this.setState({
          currentUser: userAuth
        })
      }
    })
  }

  componentWillUnmount() {
    this.unsubscribeFromAuth()
  }

  render() {
    return (
      <article className="App">

        <header>
          <h1>Firebase Demo</h1>

          {
            this.state.currentUser ?
            <button className="sign-out-top" onClick={() => auth.signOut()}>Sign Out</button>
            :
            <p className="sign-out-top message">You are not signed-in</p>
          }        
        </header>


        <div className="sign-in-and-sign-up">
          <SignIn />
          <SignUp />
        </div>

      </article>
    )
  }
}


class SignIn extends Component {

  state = {
      email: '',
      password: ''
  }

  handleSubmit = async event => {
      event.preventDefault()

      const { email, password} = this.state

      try {
          await auth.signInWithEmailAndPassword(email, password)
          this.setState({
              email: '',
              password: ''
          })

      } catch (error) {
          console.log(error)
      }
  }

  handleChange = (event) => {
      const {value, name} = event.target
      this.setState({
          [name]: value
      })
  } 

  render(){
    return(
      <section>
          <h2>I already have an account</h2>

          <span>Sign in with your email and password</span>

          <form onSubmit={this.handleSubmit}>

            <label htmlFor="emailSignIn">
              email
              <input 
                id="emailSignIn" 
                type="email" 
                name="email" 
                required 
                value={this.state.email} 
                onChange={this.handleChange} 
              />
            </label>

            <label htmlFor="passwordSignIn">
              password
              <input 
                id="passwordSignIn" 
                type="password" 
                name="password" 
                required 
                value={this.state.password} 
                onChange={this.handleChange} 
              />
            </label>

            <button type="submit" value="Submit Form">Sign in</button>

          </form>

          <p>Or, <button value="Submit Form" onClick={signInWithGoogle}>Sign In withGoogle</button></p>

      </section>
    )
  }
}

class SignUp extends Component {

  state = {
      displayName: '',
      email: '',
      password: '',
      confirmPassword: ''
  }

  handleSubmit = async event => {
      event.preventDefault()

      const { displayName, email, password, confirmPassword} = this.state

      if(password !== confirmPassword) {
          alert("Passwords don't match")
          return
      }


      try {

          const { user } = await auth.createUserWithEmailAndPassword(email, password)
          await createUserProfileDocument(user, { displayName})

          this.setState({
              displayName: '',
              email: '',
              password: '',
              confirmPassword: ''                
          })

      } catch(error){
          console.error(error)
      }
  }

  handleChange = (event) => {
      const {value, name} = event.target
      this.setState({
          [name]: value
      })
  }


  render(){
    return(
      <section>

        <h2>I do not have an account</h2>

        <span>Sign up with your email and password</span>

        <form onSubmit={this.handleSubmit}>

          <label htmlFor="displayName">
            Display Name
            <input 
              id="displayName" 
              type="text" 
              name="displayName" 
              required 
              value={this.state.displayName} 
              onChange={this.handleChange} 
            />
          </label>

          <label htmlFor="emailSignUp">
            Email
            <input 
              id="emailSignUp" 
              type="email" 
              name="email" 
              required 
              value={this.state.email} 
              onChange={this.handleChange} 
            />
          </label>

          <label htmlFor="passwordSignUp">
            Password
            <input 
              id="passwordSignUp" 
              type="password" 
              name="password" 
              required 
              value={this.state.password} 
              onChange={this.handleChange} 
            />
          </label>

          <label htmlFor="confirmPassword">
            Confirm Password
            <input 
              id="confirmPassword" 
              type="password" 
              name="confirmPassword" 
              required 
              value={this.state.confirmPassword} 
              onChange={this.handleChange} 
            />
          </label>

          <button type="submit">Sign Up</button>

        </form>

      </section>
    )
  }
}



export default App
