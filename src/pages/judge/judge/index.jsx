import { useEffect, useState } from "react";
import {
  Row,
  Button,
  Table,
  Space,
  Modal,
  message,
  Form,
  Input,
  Select,
} from "antd";
import axios from "axios";
import { useSelector } from "react-redux";
const ManagerUser = () => {
  const [list, setList] = useState([]);
  const [visible, setVisible] = useState(false);
  const [status, setStatus] = useState("attack");
  const [scoreData, setScoreData] = useState();
  const { type } = useSelector((store) => store.global);
  const [form] = Form.useForm();

  const columns = [
    {
      title: "编号",
      dataIndex: "id",
    },
    {
      title: "赛名",
      dataIndex: "name",
    },
    {
      title: "比赛结果",
      dataIndex: "reserve1",
    },
    {
      title: "状态",
      dataIndex: "reserve2",
      render: (data) => {
        if (data === "1") {
          return <>完赛</>;
        } else {
          return <>进行中</>;
        }
      },
    },
    // {
    //   title: "分数",
    //   dataIndex: "reserve4",
    // },
    {
      title: "判罚分数",
      dataIndex: "reserve5",
    },
    {
      title: "操作",
      render: (_, record) => {
        return (
          <Space>
            <Button type="primary" onClick={() => handleScore(record)}>
              判罚
            </Button>
          </Space>
        );
      },
    },
  ];
  const handleScore = (data) => {
    setScoreData(data);
    setVisible(true);
  };
  const getData = () => {
    axios.get("/api/matchuser/list").then(({ data }) => {
      setList(data.data);
    });
  };

  useEffect(() => {
    getData();
  }, []);

  const onFinish = (data) => {
    axios
      .post("/api/matchuser/update", { ...scoreData, reserve5: data.reserve5 })
      .then(({ data }) => {
        if(data.success){
          getData()
          setVisible(false)
        }else{
          message.error(data.message)
        }
      });
  };
  const onFinishFailed = () => {};
  return (
    <>
      <Table columns={columns} dataSource={list} key={"id"} />
      <Modal
        title={"评分"}
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
          <Form.Item
            label="请评分"
            name="reserve5"
            rules={[{ required: true, message: "Please input your path!" }]}
          >
            <Input />
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

export default ManagerUser;
