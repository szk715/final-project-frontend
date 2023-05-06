import { useEffect, useState } from "react";
import moment from 'moment'
import {
  Button,
  Card,
  Space,
  Modal,
  Form,
  Input,
  message,
  Upload,
  Select,
} from "antd";
import { fetchData, DelData, AddData } from "../../../api/index";
import { DatePicker   } from 'antd';
import axios from "axios";
import "./index.less";
const Game = () => {
  const [list, setList] = useState([]);
  const [sceneList, setSceneList] = useState([]);
  const [judgeList, setJudgeList] = useState([]);
  const [visible, setVisible] = useState(false);
  const [status, setStatus] = useState("add");

  const [form] = Form.useForm();
  useEffect(() => {
    getData();
    getSceneData();
    getJudgeData();
  }, []);
  const getData = () => {
    axios.get("/api/match/list").then(({ data }) => {
      setList(data.data);
    });
  };
  const handleDel = (id) => {
    Modal.confirm({
      title: "确定删除此比赛吗?",
      onOk: () => {
        axios.get(`/api/match/delete?id=${id}`).then(({ data }) => {
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
  const getSceneData = () => {
    axios.get("/api/scene/list").then(({ data }) => {
      setSceneList(data.data);
    });
  };
  const onFinish = (data) => {
    debugger
    console.log(data.reserve2);
    const temp = sceneList.filter((item) => item.id == data.reserve3);
    if (status === "add") {
      axios
        .post("/api/match/save", {
          name: "",
          reserve1: temp[0].reserve1,
          reserve2: "",
          reserve3: "",
          reserve4: temp[0].matchid,
          reserve5: "",
          status: moment(data.status).format('YYYY-MM-DD'),
          ...data,
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
        .post("/api/match/update", {
          name: "",
          reserve1: temp[0].reserve1,
          reserve2: "",
          reserve3: "",
          reserve4: temp[0].matchid,
          reserve5: "",
          status: "",
          ...data,
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
      reserve5: "",     
      status: "",
    });
  };
  const fileChange = (info) => {
    console.log(info.file?.response);
    if (info.file?.response) {
      form.setFieldsValue({
        reserve1: window.location.host + info.file?.response?.data,
      });
    }
  };
  const getJudgeData = () => {
    axios.get("/api/user/list").then(({ data }) => {
      setJudgeList(data.data.filter((item) => item.type == 1));
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
          新增比赛
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
              <div>
                拓扑图：
                <img src={item.reserve1} alt="" width={100} height={100} />
              </div>
              <div>
                裁判：
                <Select
                  placeholder="请选择裁判"
                  value={+item.reserve2}
                  // onChange={onGenderChange}
                  // allowClear
                  disabled
                >
                  {judgeList.map((val, index) => (
                    <Option value={val.id}>{val.username}</Option>
                  ))}
                </Select>
              </div>
            </Card>
          ))}
        </Space>
      </div>
      <Modal
        title={status === "add" ? "新增比赛" : "编辑比赛"}
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
            label="名称"
            name="name"
            rules={[{ required: true, message: "Please input your name!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
                            label="结束时间"
                            name="status"
                            >

<DatePicker  format="YYYY-MM-DD HH:mm:ss" />


                            
             </Form.Item>
          {/* //reserve1为拓扑图地址 reserve4为靶机id*/}
          <Form.Item
            label="选择场景"
            name="reserve3"
            rules={[{ required: true, message: "Please input your path!" }]}
          >
            <Select
              placeholder="请选择场景"
              // onChange={onGenderChange}
              // allowClear
            >
              {sceneList.map((item) => (
                <Option value={item.id}>{item.name}</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            label="裁判"
            name="reserve2"
            rules={[{ required: true, message: "Please input your path!" }]}
          >
            <Select
              placeholder="请选择裁判"
              // onChange={onGenderChange}
              // allowClear
            >
              {judgeList.map((val, index) => (
                <Option value={val.id}>{val.username}</Option>
              ))}
            </Select>
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

export default Game;
