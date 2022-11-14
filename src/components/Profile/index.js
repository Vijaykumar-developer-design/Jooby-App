import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'

import './index.css'

const profileStatus = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class Profile extends Component {
  state = {updatedProfile: {}, profileSta: profileStatus.initial}

  componentDidMount() {
    this.getProfile()
  }

  getProfile = async () => {
    this.setState({profileSta: profileStatus.inProgress})
    const jwtToken = Cookies.get('jwt_token')
    const url = 'https://apis.ccbp.in/profile'
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }

    const response = await fetch(url, options)
    // console.log(response)
    const data = await response.json()
    if (response.ok === true) {
      const profileDetails = data.profile_details
      const updatedProfile = {
        name: profileDetails.name,
        profileImageUrl: profileDetails.profile_image_url,
        shortBio: profileDetails.short_bio,
      }
      //   console.log(updatedProfile)
      this.setState({updatedProfile, profileSta: profileStatus.success})
    } else {
      this.setState({profileSta: profileStatus.failure})
    }
  }

  onClickRetry = () => {
    this.getProfile()
  }

  renderProfileDetails = () => {
    const {updatedProfile} = this.state
    const {profileImageUrl, name, shortBio} = updatedProfile

    return (
      <div className="jjj">
        <div className="profile-bg">
          <img src={profileImageUrl} alt="profile" />
          <h1 className="profile-name">{name}</h1>
          <p>{shortBio}</p>
        </div>
      </div>
    )
  }

  renderLoadingView = () => (
    //   testid="loader"
    <div testid="loader" className="loader-container">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderFailure = () => (
    <div className="retry-div">
      <button onClick={this.onClickRetry} className="retry" type="button">
        Retry
      </button>
    </div>
  )

  renderProfile = () => {
    const {profileSta} = this.state
    switch (profileSta) {
      case profileStatus.inProgress:
        return this.renderLoadingView()
      case profileStatus.success:
        return this.renderProfileDetails()
      case profileStatus.failure:
        return this.renderFailure()
      default:
        return null
    }
  }

  render() {
    return <div>{this.renderProfile()}</div>
  }
}

export default Profile
