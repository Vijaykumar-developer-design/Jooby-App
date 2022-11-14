import {Component} from 'react'
import {Link} from 'react-router-dom'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
import {BsSearch, BsFillBagFill} from 'react-icons/bs'
import {GoLocation} from 'react-icons/go'
import {AiFillStar} from 'react-icons/ai'
import './index.css'
import Employment from '../EmploymentOptions'
import Header from '../Header'
import Profile from '../Profile'

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]

const ListStatus = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class ActiveJobList extends Component {
  state = {
    activeJobs: [],
    requestStatus: ListStatus.initial,
    searchInput: '',
    employmentType: [],
    salaryRange: 0,
  }

  componentDidMount() {
    this.getAllJobs()
  }

  getAllJobs = async () => {
    const {employmentType, salaryRange, searchInput} = this.state
    // const types = employmentType.from(new Set(employmentType))
    // console.log(types)
    this.setState({requestStatus: ListStatus.inProgress})
    const jwtToken = Cookies.get('jwt_token')
    const url = `https://apis.ccbp.in/jobs?employment_type=${employmentType.join()}&minimum_package=${salaryRange}&search=${searchInput}`

    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }

    const response = await fetch(url, options)
    const data = await response.json()

    if (response.ok === true) {
      const updatedData = data.jobs.map(each => ({
        companyLogoUrl: each.company_logo_url,
        employmentType: each.employment_type,
        id: each.id,
        jobDescription: each.job_description,
        location: each.location,
        package: each.package_per_annum,
        rating: each.rating,
        title: each.title,
      }))
      console.log(updatedData)
      this.setState({
        activeJobs: updatedData,
        requestStatus: ListStatus.success,
      })
    } else {
      this.setState({requestStatus: ListStatus.failure})
    }
  }

  changeSearchInput = event => {
    this.setState({searchInput: event.target.value})
  }

  onEnterKey = event => {
    if (event.key === 'Enter') {
      this.getAllJobs()
    }
  }

  OnClickSearchJob = () => {
    this.getAllJobs()
  }

  renderSuccessView = () => {
    const {activeJobs} = this.state

    return (
      <div>
        <ul className="active-list">
          {activeJobs.map(each => (
            <Link key={each.id} className="link-card" to={`/jobs/${each.id}`}>
              <li className="job-card">
                <div>
                  <div className="logo-container">
                    <img
                      className="logo"
                      src={each.companyLogoUrl}
                      alt="company logo"
                    />
                    <div>
                      <h1>{each.title}</h1>
                      <div className="rating-container">
                        <AiFillStar className="fill" />
                        <p>{each.rating}</p>
                      </div>
                    </div>
                  </div>
                  <div className="location-lpa">
                    <div className="icons-flex">
                      <GoLocation className="icons" />
                      <p>{each.location}</p>
                    </div>
                    <div className="icons-flex">
                      <BsFillBagFill className="icons" />
                      <p>{each.employmentType}</p>
                    </div>
                    <p>{each.package} </p>
                  </div>
                  <hr />
                  <h1>Description</h1>
                  <p>{each.jobDescription}</p>
                </div>
              </li>
            </Link>
          ))}
        </ul>
      </div>
    )
  }

  onClickReloadList = () => {
    this.getAllJobs()
  }

  renderNoJobsFound = () => (
    <div className="no-jobs">
      <img
        className="no-job-img"
        src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
        alt="no jobs"
      />
      <h1 className="no-jobs-text">No Jobs Found</h1>
      <p className="no-jobs-text">
        We could not find any jobs. Try other filters
      </p>
    </div>
  )

  showJobs = () => {
    const {activeJobs} = this.state
    return activeJobs.length > 0
      ? this.renderSuccessView()
      : this.renderNoJobsFound()
  }

  renderFailureView = () => (
    <div className="failure-div">
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

  renderLoadingView = () => (
    //   testid="loader"

    <div
      //  testid="loader"
      className="loader-container"
    >
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderJobsList = () => {
    const {requestStatus} = this.state

    switch (requestStatus) {
      case ListStatus.success:
        return this.showJobs()
      case ListStatus.failure:
        return this.renderFailureView()
      case ListStatus.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  changeEmploymentType = value => {
    this.setState(
      prevState => ({
        employmentType: [...prevState.employmentType, value],
      }),
      this.getAllJobs,
    )
  }

  changeSalaryRange = salary => {
    this.setState({salaryRange: salary}, this.getAllJobs)
  }

  render() {
    const {searchInput} = this.state
    return (
      <div className="active-bg-container">
        <Header />
        <div className="flex-dives">
          <div>
            <Profile />
            <Employment
              employmentTypesList={employmentTypesList}
              salaryRangesList={salaryRangesList}
              changeEmploymentType={this.changeEmploymentType}
              changeSalaryRange={this.changeSalaryRange}
            />
          </div>
          <div>
            <div className="search-div">
              <input
                value={searchInput}
                onChange={this.changeSearchInput}
                onKeyDown={this.onEnterKey}
                placeholder="Search"
                className="search-input"
                type="search"
              />
              <button
                // testid="searchButton"
                onClick={this.OnClickSearchJob}
                className="search-btn"
                type="button"
              >
                <BsSearch className="search-icon" />
              </button>
            </div>
            {this.renderJobsList()}
          </div>
        </div>
      </div>
    )
  }
}

export default ActiveJobList
