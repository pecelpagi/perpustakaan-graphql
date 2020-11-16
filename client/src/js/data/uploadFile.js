import request from "superagent";

const API_BASE_URL = "http://localhost:3301";

const upload = file => new Promise((resolve, reject) => {
  let req = request.post(`${API_BASE_URL}/api/uploadFile`);
  req = req.attach("photo", file);
  req.end((err, res) => {
    if (err) {
      reject(err);
    }

    resolve(res.body);
  });
});

export default upload;
