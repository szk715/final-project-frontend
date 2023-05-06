import { useEffect, useState } from "react";
import {
  Button,
  Card,
  Space,
  Modal,
  Form,
  Input,
  message,
  Select,
  Upload,
} from "antd";
import { fetchData, DelData, AddData } from "../../../api/index";
import axios from "axios";
import "./index.less";
const ManagerMirror = () => {
  const [list, setList] = useState([]);
  const [weaponList, setWeaponList] = useState([]);
  const [visible, setVisible] = useState(false);
  const [status, setStatus] = useState("add");
  const [imgUrl, setImgUrl] = useState();
  const [form] = Form.useForm();
  useEffect(() => {
    getData();
    getWeaponList();
  }, []);
  const getData = () => {
    axios.get("/api/scene/list").then(({ data }) => {
      setList(data.data);
    });
  };
  //获取靶机列表
  const getWeaponList = () => {
    axios.get("/api/weapon/list").then(({ data }) => {
      setWeaponList(data.data);
    });
  };
  const handleDel = (id) => {
    Modal.confirm({
      title: "确定删除此场景吗?",
      onOk: () => {
        axios.get(`/api/scene/delete?id=${id}`).then(({ data }) => {
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
  const props = {
    name: "file",
    action: "/api/images/upload",
    onChange(info) {
      console.log("info", info);
      if (info?.file?.response?.success) {
        form.setFieldValue({
          reserve1: info.file.response.data,
        });
        console.log(info.file.response.data);
        setImgUrl(info.file.response.data);
      }
    },
  };
  console.log(imgUrl);
  const onFinish = (data) => {
    debugger
    if (status === "add") {
      axios
        .post("/api/scene/save", {
          reserve2: "",
          reserve3: "",
          reserve4: "",
          reserve5: "",
          reserve1: imgUrl,
          status: "",
          user: "",
          name:data.name,
          matchid:data.matchid

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
        .post("/api/scene/update", data)
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
    form.setFieldsValue({
      name: "",
      reserve1: "",
      reserve2: "",
      reserve3: "",
      reserve4: "",
    });
  };
  return (
    <>
      <div>
        <Button
          type="primary"
          onClick={handleAdd}
          style={{ marginBottom: "20px" }}
        >
          新增场景
        </Button>
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
              style={{ width: 300 }}
            >
              <p>创建人：{item.user}</p>
              <p>
                靶机：
                <Select
                  placeholder="请选择靶机"
                  // onChange={onGenderChange}
                  value={+item.matchid}
                  disabled
                >
                  {weaponList.map((val) => (
                    <Option value={val.id}>{val.name}</Option>
                  ))}
                  <Option value={10}>{"测试靶机"}</Option>
                </Select>
              </p>
              <div>
                图片：
                <img src={item.reserve1} alt="" width={100} height={100} />
              </div>
            </Card>
          ))}
        </Space>
      </div>
      <Modal
        title={status === "add" ? "新增场景" : "编辑场景"}
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
            label="场景名称"
            name="name"
            rules={[{ required: true, message: "Please input your name!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="图片地址"
            name="reserve1"
     
          >
            <Upload {...props}>
              <Button>上传图片</Button>
            </Upload>
            {/* <p>{imgUrl}</p> */}
            <Input value={imgUrl} disabled/>
          </Form.Item>
          <Form.Item
            label="选择靶机"
            name="matchid"
            rules={[{ required: true, message: "请选择靶机" }]}
          >
            <Select
              placeholder="请选择靶机"
              // onChange={onGenderChange}
              allowClear
            >
              {weaponList.map((item) => (
                <Option value={item.id}>{item.name}</Option>
              ))}
            </Select>
          </Form.Item>
          {/* <Form.Item
            label="账号"
            name="reserve3"
            rules={[{ required: true, message: "Please input your path!" }]}
          >
            <Input disabled={status==='edit'}/>
          </Form.Item> */}
          {/* <Form.Item
            label="密码"
            name="reserve4"
            rules={[{ required: true, message: "Please input your path!" }]}
          >
            <Input disabled={status==='edit'}/>
          </Form.Item> */}

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

export default ManagerMirror;
