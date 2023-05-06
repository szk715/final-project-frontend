import { useEffect, useState } from "react";
import { Button, Card, Space, Modal, Form, Input, message, Upload } from "antd";
import { fetchData, DelData, AddData } from "../../../api/index";
import axios from "axios";
import "./index.less";
const Weapon = () => {
  const [list, setList] = useState([]);
  const [visible, setVisible] = useState(false);
  const [status, setStatus] = useState("add");
  const [imgUrl, setImgUrl] = useState();
  const [form] = Form.useForm();
  useEffect(() => {
    getData();
  }, []);
  const getData = () => {
    axios.get("/api/images/list").then(({ data }) => {
      setList(data.data);
    });
  };

  const props = {
    name: "file",
    action: "/api/images/upload",
    onChange(info) {        
      console.log("info", info);
      if (info?.file?.response?.success) {
        console.log(info.file.response.data);
        form.setFieldValue({
            path: info.file.response.data,
        });
        setImgUrl(info.file.response.data);
    
      }
    },
  };
  const handleDel = (id) => {
    Modal.confirm({
      title: "确定删除此镜像吗?",
      onOk: () => {
        axios.get(`/api/images/delete?id=${id}`).then(({ data }) => {
          console.log(data);
          if (data.success) {
            message.success("删除成功");
            getData();
          } else {
            message.error(data.message);
          }
        });
      },
    });
  };
  const onFinish = (data) => {
    
    if (status === "add") {
      axios
        .post("/api/images/save", {
          reserve1: "",
          reserve2: "",
          reserve3: "",
          reserve4: "",
          reserve5: "",
          path:imgUrl,
          status: "",
          name:data.name
       
        })
        .then(({ data }) => {
          if (data.success) {
            getData();
            setVisible(false);
          } else {
            message.error(data.message);
          }
        })
        .catch(() => {
          message.error("新增失败");
        });
    } else {
      axios
        .post("/api/images/update", data)
        .then(({ data }) => {
          if (data.success) {
            getData();
            setVisible(false);
          } else {
            message.error(data.message);
          }
        })
        .catch(() => {
          message.error("修改失败");
        });
    }
  };
  const onFinishFailed = () => {};
  const handleEdit = (item) => {
    setStatus("edit");
    setVisible(true);
    form.setFieldsValue({ ...item });
  };
  const handleAdd = () => {
    setVisible(true);
    setStatus("add");
    form.setFieldsValue({ name: "", path: "" });
  };
  return (
    <>
      <div style={{ marginBottom: "20px" }}>
        <Space>
          <Button type="primary" onClick={handleAdd}>
            新增镜像
          </Button>
          {/* <Upload {...props}>
            <Button>上传</Button>
          </Upload> */}
        </Space>
      </div>
      <div className="images-content">
        <Space style={{ flexWrap: "wrap" }}>
          {list.map((item, index) => (
            <Card
              size="small"
              key={index}
              extra={
                <>
                  <Button type="link" onClick={() => handleEdit(item)}>
                    编辑
                  </Button>
                  <Button type="link" danger onClick={() => handleDel(item.id)}>
                    删除
                  </Button>
                </>
              }
              title={item.name}
              style={{ width: 335 }}
            >
              <p>{item.path}</p>
            </Card>
          ))}
        </Space>
      </div>
      <Modal
        title={status === "add" ? "新增镜像" : "编辑镜像"}
        open={visible}
        footer={null}
        onCancel={() => setVisible(false)}
      >
        <Form
          name="form"
          form={form}
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          style={{ maxWidth: 600 }}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          {status === "edit" && (
            <Form.Item label="id" name="id">
              <Input disabled />
            </Form.Item>
          )}
          <Form.Item
            label="name"
            name="name"
            rules={[{ required: true, message: "Please input your name!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="path"
            name="path"
          
          >   
      <Upload {...props}>
              <Button>上传镜像</Button>
            </Upload>
            {/* <p>{imgUrl}</p> */}
            <Input value={imgUrl} disabled/>
          </Form.Item>
       
          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type="primary" htmlType="submit">
              确认
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default Weapon;
