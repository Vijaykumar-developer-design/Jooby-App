import {Component} from 'react'
import {Redirect} from 'react-router-dom'
import Cookies from 'js-cookie'
import './index.css'

class LoginForm extends Component {
  state = {username: '', password: '', showErrorMsg: false, errorMsg: ''}

  onSuccess = jwtToken => {
    Cookies.set('jwt_token', jwtToken, {expires: 30})
    const {history} = this.props
    history.replace('/')
  }

  submitForm = async event => {
    event.preventDefault()
    const {username, password} = this.state
    const userDetails = {username, password}
    const url = 'https://apis.ccbp.in/login'
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }
    const response = await fetch(url, options)
    const data = await response.json()
    if (response.ok === true) {
      const jwtToken = data.jwt_token
      this.onSuccess(jwtToken)
      this.setState({username: '', password: ''})
    } else {
      this.setState({showErrorMsg: true, errorMsg: data.error_msg})
    }
  }

  getUsername = event => [this.setState({username: event.target.value})]

  getPassword = event => this.setState({password: event.target.value})

  renderUserForm = () => {
    const {showErrorMsg, errorMsg} = this.state
    return (
      <form onSubmit={this.submitForm} className="form-background">
        <img
          className="image"
          src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
          alt="website logo"
        />
        <div className="inputs">
          <label className="name-text" htmlFor="name">
            USERNAME
          </label>
          <input
            placeholder="Username"
            onChange={this.getUsername}
            type="text"
            className="username"
            id="name"
          />
        </div>
        <div className="inputs">
          <label className="name-text" htmlFor="passwd">
            PASSWORD
          </label>
          <input
            placeholder="Password"
            onChange={this.getPassword}
            type="password"
            className="username"
            id="passwd"
          />
        </div>
        <button className="submit-btn" type="submit">
          Login
        </button>
        {showErrorMsg && <p className="error-message">*{errorMsg}</p>}
      </form>
    )
  }

  render() {
    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken !== undefined) {
      return <Redirect to="/" />
    }

    return <div className="login-background">{this.renderUserForm()}</div>
  }
}

export default LoginForm
