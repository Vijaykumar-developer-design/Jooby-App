import {BsFillBagFill} from 'react-icons/bs'
import {GoLocation} from 'react-icons/go'
import './index.css'

const SimilarJobs = props => {
  const {similarJob} = props
  const {
    companyLogo,
    employmentType,
    id,
    location,
    title,
    jobDescription,
    rating,
  } = similarJob

  return (
    <li className="similar-card" key={id}>
      <div className="s-s">
        <img
          className="logo-s"
          src={companyLogo}
          alt="similar job company logo"
        />
        <div>
          <h1>{title}</h1>
          <div className="rating-container">
            <img
              alt="star"
              src="https://assets.ccbp.in/frontend/react-js/appointments-app/filled-star-img.png"
            />
            <p>{rating}</p>
          </div>
        </div>
      </div>
      <h1>Description</h1>
      <p>{jobDescription}</p>
      <div className="location-similar">
        <div className="icons-flex">
          <GoLocation className="icons" />
          <p>{location}</p>
        </div>
        <div className="icons-flex">
          <BsFillBagFill className="icons" />
          <p>{employmentType}</p>
        </div>
      </div>
    </li>
  )
}

export default SimilarJobs
