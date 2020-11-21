/* eslint prop-types: 0 */
import React from "react";
import PropTypes from "prop-types";
import Cropper from "react-cropper";
import ModalPopup from "./ModalPopup";
import uploadFile from "../data/uploadFile";
import { createPathPreview } from "../utils";

require("cropperjs/dist/cropper.css");

const getFileName = (length = 4) => {
  let result = "";
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i += 1) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};
const style = { display: "inline-block" };
class ImageUpload extends React.Component {
  static propTypes = {
    errorText: PropTypes.string,
  }

  static defaultProps = {
    errorText: undefined,
  }

  constructor(props) {
    super(props);

    this.state = {
      isShowing: false,
      imgValue: "",
      tempImg: "",
      fileName: "",
    };
  }

  componentWillMount = () => {
    const { value } = this.props;

    this.setState({ imgValue: value, tempImg: createPathPreview(value) });
  }

  componentWillReceiveProps = (nextProps) => {
    const { value } = this.props;

    if (value !== nextProps.value) {
      this.setState({ imgValue: nextProps.value, tempImg: createPathPreview(nextProps.value) });
    }
  }

  chooseFile = () => {
    this.fileUpload.click();
  }

  changeFileHandler = () => {
    const file = this.fileUpload.files[0];
    const reader = new FileReader();
    reader.addEventListener("load", () => {
      this.setState({ tempImg: reader.result, fileName: file.name }, () => {
        this.showModal();
      });
    }, false);

    if (file) {
      reader.readAsDataURL(file);
    }
  }

  showModal = () => {
    const { tempImg, imgValue } = this.state;
    let newTempImg = imgValue;

    if (tempImg && String(tempImg).length > 0) {
      newTempImg = tempImg;
    }

    this.setState({ isShowing: true, tempImg: newTempImg });
  }

  hideModal = () => {
    this.setState({ isShowing: false });
  }

  dataURLtoFile = (dataurl, filename) => {
    const arr = dataurl.split(",");
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n > -1) {
      u8arr[n] = bstr.charCodeAt(n);
      n -= 1;
    }
    return new File([u8arr], filename, { type: mime });
  }

  applyCroppedImage = () => {
    const croppedImg = this.cropper.getCroppedCanvas().toDataURL("image/jpeg");
    const file = this.dataURLtoFile(croppedImg, `${getFileName()}.jpeg`);
    this.doUploadingFile(file);
  }

  doUploadingFile = async (file) => {
    const res = await uploadFile(file);

    if (res.status) {
      const { path } = res.data;

      this.setState({ imgValue: path, isShowing: false }, () => {
        const { imgValue, fileName } = this.state;
        const { changeEvent } = this.props;

        changeEvent(imgValue, fileName);
        this.fileUpload.value = null;
      });
    }
  }

  removeImage = () => {
    const { changeEvent } = this.props;

    this.setState({ imgValue: "", tempImg: "" });
    changeEvent("", "");
  }

  render() {
    const {
      errorText,
    } = this.props;
    const { isShowing, imgValue, tempImg } = this.state;
    const isImageFilled = (imgValue && imgValue.length > 0);

    return (
      <div style={style} className={`form-group mb-reset ${(errorText && errorText.length > 0) ? "has-error" : ""}`}>
        <div className="image-preview-wrapper">
          <div className="preview">
            { isImageFilled && (
              <div className="btn-wrapper">
                <button type="button" className="btn btn-default btn-edit" onClick={this.showModal}><i className="fa fa-edit" /></button>
                <button type="button" className="btn btn-default btn-remove" onClick={this.removeImage}><i className="fa fa-close" /></button>
              </div>
            ) }
            { isImageFilled && <img src={createPathPreview(imgValue)} /> }
          </div>
          <button type="button" onClick={this.chooseFile} className="btn btn-default btn-block btn-upload">Unggah Gambar</button>
        </div>
        {(errorText && errorText.length > 0) && <span className="help-block">{errorText}</span>}
        <input ref={(c) => { this.fileUpload = c; }} onChange={this.changeFileHandler} className="hidden" type="file" accept="image/*" />
        {isShowing
          && <ModalPopup width={340} title="Custom Foto" hideModal={this.hideModal} saveHandler={this.applyCroppedImage}>
            <div>
              <Cropper
                ref={(c) => { this.cropper = c; }}
                src={tempImg}
                style={{ height: 300, width: "100%" }}
                // aspectRatio={2 / 3}
                guides={false}
                crop={() => {}} />
            </div>
          </ModalPopup>
        }
      </div>
    );
  }
}

export default ImageUpload;
