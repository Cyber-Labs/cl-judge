import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Modal, Button, Alert, Tooltip, OverlayTrigger } from 'react-bootstrap'
import ImageUploading from 'react-images-uploading'
import baseUrl from '../../shared/baseUrl'
import MiniLoader from '../common/MiniLoader'

function UploadProfileImage (props) {
  const [uploadProgress, setUploadProgress] = useState(false)
  const [uploadError, setUploadError] = useState('')

  const { userInfo, accessToken, setUserInfo } = props
  const reqHeaders = new Headers()
  reqHeaders.append('access_token', accessToken)

  const [showModal, setShowModal] = useState(false)
  const handleClose = () => setShowModal(false)
  const handleShow = () => setShowModal(true)
  const [image, setImage] = React.useState([])

  const { profile_img: defaultProfileImage } = userInfo

  const onChange = (imageList, addUpdateIndex) => {
    // data for submit
    setImage(imageList)
  }

  const submitImage = () => {
    setUploadProgress(true)
    const formdata = new FormData()
    formdata.append('profileImage', image[0].file)
    const requestOptions = {
      method: 'POST',
      headers: reqHeaders,
      body: formdata
    }
    fetch(`${baseUrl}/user/update_profile_image`, requestOptions)
      .then((res) => res.json())
      .then((res) => {
        const { success, error, results } = res
        if (success) {
          const { profileImg } = results
          setUserInfo({ ...userInfo, profile_img: profileImg })
          setUploadError('')
          handleClose()
        } else {
          setUploadError(error)
        }
        setUploadProgress(false)
      })
      .catch((error) => {
        setUploadError(error.message)
        setUploadProgress(false)
      })
  }

  const updateImageTooltip = (props) => (
    <Tooltip id="upload-image-tooltip" {...props}>
      Click here to update profile image
    </Tooltip>
  )

  return (
    <div className="row mt-5 ">
      <div className="col text-center">
        <div
          role="button"
          onClick={handleShow}
          onKeyDown={handleShow}
          style={{ cursor: 'pointer' }}
        >
          <OverlayTrigger
            placement="right"
            delay={{ show: 250, hide: 400 }}
            overlay={updateImageTooltip}
          >
            <img
              alt="User Profile Image"
              width="250px"
              height="250px"
              src={defaultProfileImage || '/images/profile.png'}
            />
          </OverlayTrigger>
        </div>
      </div>
      <Modal
        size="lg"
        aria-labelledby="profile-image-upload-modal"
        centered
        show={showModal}
        onHide={handleClose}
      >
        <Modal.Header closeButton>
          <Modal.Title id="profile-image-upload-modal">
            Upload Profile Image
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ImageUploading
            value={image}
            onChange={onChange}
            acceptType={['jpg', 'png', 'jpeg']}
            maxFileSize={5242880}
            dataURLKey="data_url"
          >
            {({
              imageList,
              onImageUpload,
              onImageUpdate,
              onImageRemove,
              isDragging,
              dragProps,
              errors
            }) => (
              <div
                className="container upload__image-wrapper text-center"
                {...dragProps}
              >
                <Button
                  style={isDragging ? { color: 'gold' } : undefined}
                  onClick={
                    imageList.length
                      ? () => {
                          onImageUpdate(0)
                        }
                      : onImageUpload
                  }
                >
                  Choose image or Drop here
                </Button>
                &nbsp;
                <br />
                {!imageList.length && (
                  <div className="image-item">
                    <br />
                    <img
                      src={defaultProfileImage || '/images/profile.png'}
                      alt=""
                      width="250"
                      height="250"
                    />
                  </div>
                )}
                {imageList.map((image, index) => (
                  <div key={index} className="image-item">
                    <br />
                    <img src={image.data_url} alt="" width="250" height="250" />
                    <div className="image-item__btn-wrapper">
                      <br />
                      <div style={{ color: 'red' }}>
                        {errors && errors.acceptType && (
                          <span>
                            Only .png, .jpg and .jpeg files are allowed
                          </span>
                        )}
                        {errors && errors.maxFileSize && (
                          <span>Selected file size should not exceed 5MB</span>
                        )}
                      </div>
                      <div>
                        <br />
                        <span>Recommended Dimensions : 250x250</span>
                      </div>
                      <br />
                      {uploadError && (
                        <Alert variant="danger">{uploadError}</Alert>
                      )}
                      <Button
                        onClick={submitImage}
                        disabled={errors || uploadProgress}
                        variant="success"
                      >
                        &nbsp; Upload &nbsp;
                        {uploadProgress && <MiniLoader />}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ImageUploading>
        </Modal.Body>
      </Modal>
    </div>
  )
}

UploadProfileImage.propTypes = {
  accessToken: PropTypes.string.isRequired,
  setUserInfo: PropTypes.func.isRequired,
  userInfo: PropTypes.shape({
    profile_img: PropTypes.string
  })
}

export default UploadProfileImage
