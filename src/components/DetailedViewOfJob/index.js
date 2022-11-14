import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
import {BsFillBagFill} from 'react-icons/bs'
import {AiFillStar} from 'react-icons/ai'
import {GoLocation, GoLinkExternal} from 'react-icons/go'
import Skill from '../Skills'
import SimilarJobs from '../SimilarJobs'
import Header from '../Header'
import './index.css'

const DetailedStatus = {
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}
class DetailedView extends Component {
  state = {
    presentJob: {},
    skills: [],
    similarJobs: [],
    companyLife: {},
    apiStatus: '',
  }

  componentDidMount() {
    this.getDetails()
  }

  getDetails = async () => {
    this.setState({apiStatus: DetailedStatus.inProgress})
    const {match} = this.props
    const {params} = match
    const {id} = params
    const jwtToken = Cookies.get('jwt_token')
    const url = `https://apis.ccbp.in/jobs/${id}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(url, options)
    if (response.ok === true) {
      const data = await response.json()
      //   console.log(data)

      const updatedDetails = {
        companyLogo: data.job_details.company_logo_url,
        companyWebUrl: data.job_details.company_website_url,
        employmentType: data.job_details.employment_type,
        id: data.job_details.id,
        jobDescription: data.job_details.job_description,
        location: data.job_details.location,
        packageLpa: data.job_details.package_per_annum,
        rating: data.job_details.rating,
        title: data.job_details.title,
      }
      //   console.log(updatedDetails)
      //   console.log(data.job_details.skills)
      const updatedSkills = data.job_details.skills.map(each => ({
        skillImgUrl: each.image_url,
        skillName: each.name,
      }))
      console.log(updatedSkills)

      const similarJobs = data.similar_jobs.map(each => ({
        companyLogo: each.company_logo_url,
        employmentType: each.employment_type,
        id: each.id,
        jobDescription: each.job_description,
        location: data.job_details.location,
        rating: data.job_details.rating,
        title: data.job_details.title,
      }))
      const companyDetails = {
        description: data.job_details.life_at_company.description,
        imageUrl: data.job_details.life_at_company.image_url,
      }

      this.setState({
        presentJob: updatedDetails,
        similarJobs,
        skills: updatedSkills,
        apiStatus: DetailedStatus.success,
        companyLife: companyDetails,
      })
    } else {
      this.setState({apiStatus: DetailedStatus.failure})
    }
  }

  renderLifeAtCompany = () => {
    const {companyLife} = this.state
    const {imageUrl, description} = companyLife
    return (
      <div>
        <h1>Life at Company</h1>
        <div className="life-div">
          <p>{description}</p>
          <img className="life-img" src={imageUrl} alt="life at company" />
        </div>
      </div>
    )
  }

  renderSuccessView = () => {
    const {presentJob, skills} = this.state
    const {
      employmentType,
      companyLogo,
      companyWebUrl,
      jobDescription,
      location,
      packageLpa,
      rating,
      title,
    } = presentJob
    return (
      <div className="job-card-detailed">
        <div>
          <div className="logo-container">
            <img
              className="logo-cm"
              src={companyLogo}
              alt="job details company logo"
            />
            <div>
              <h1>{title}</h1>
              <div className="rating-container">
                <AiFillStar className="fill" />
                <p>{rating}</p>
              </div>
            </div>
          </div>

          <div className="location-lpa-d">
            <div className="icons-flex">
              <GoLocation className="icons" />
              <p>{location}</p>
            </div>
            <div className="icons-flex">
              <BsFillBagFill className="icons" />
              <p>{employmentType}</p>
            </div>
            <p>{packageLpa} </p>
          </div>

          <hr />
          <div className="web-link">
            <h1>Description</h1>
            <a
              className="anchor"
              href={companyWebUrl}
              rel="noreferrer"
              target="_blank"
            >
              <div className="link-div">
                Visit
                <GoLinkExternal />
              </div>
            </a>
          </div>
          <p>{jobDescription}</p>
          <h1>Skills</h1>

          <ul className="skills-lists">
            {skills.map(each => (
              <Skill skillList={each} key={each.skillName} />
            ))}
          </ul>

          {this.renderLifeAtCompany()}
        </div>
      </div>
    )
  }

  renderSuccessList = () => (
    <div>
      {this.renderSuccessView()} {this.renderSimilar()}
    </div>
  )

  renderSimilar = () => {
    const {similarJobs} = this.state
    return (
      <>
        <h1 className="similar-head">Similar Jobs</h1>
        <ul className="similar-list">
          {similarJobs.map(each => (
            <SimilarJobs similarJob={each} key={each.id} />
          ))}
        </ul>
      </>
    )
  }

  onClickReloadList = () => {
    this.getDetails()
  }

  renderFailureView = () => (
    <div className="failure-div-similar">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png "
        alt="failure view"
      />
      <h1>Oops! Something Went Wrong</h1>
      <p>We cannot seem to find the page you are looking for</p>
      <button
        onClick={this.onClickReloadList}
        className="failure-retry"
        type="button"
      >
        Retry
      </button>
    </div>
  )

  renderLoadindView = () => (
    //   testid="loader"
    <div className="loader-container">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderResult = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case DetailedStatus.success:
        return this.renderSuccessList()
      case DetailedStatus.failure:
        return this.renderFailureView()
      case DetailedStatus.inProgress:
        return this.renderLoadindView()

      default:
        return null
    }
  }

  render() {
    return (
      <div className="similar-bg">
        <Header />
        {this.renderResult()}
      </div>
    )
  }
}

export default DetailedView
