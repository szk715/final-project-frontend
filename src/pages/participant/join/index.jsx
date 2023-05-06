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
  const [weaponList, setWeaponList] = useState([]);
  const [visible, setVisible] = useState(false);
  const [status, setStatus] = useState("attack");
  const [attackData, setAttackData] = useState();
  const { type } = useSelector((store) => store.global);
  const [form] = Form.useForm();
  const handleEdit = (data) => {
    Modal.confirm({
      title: "开始比赛",
      content: "确认开始比赛吗？",
      onOk: () => {
        handleStart(data);
      },
    });
  };
  const handleStart = (data) => {
    axios
      .post("/api/match/update", {
        ...data,
        reserve5: "start",
      })
      .then(({ data }) => {
        if (data.success) {
          message.success("比赛开始");
          getData();
        } else {
          message.error(data.error);
        }
      });
  };
  const columns = [
    {
      title: "赛名",
      dataIndex: "name",
    },
    {
      title: "拓扑图地址",
      dataIndex: "reserve1",
    },
    {
      title: "裁判",
      dataIndex: "reserve2",
    },
    {
      title: "靶机id",
      dataIndex: "reserve4",
    },
    {
      title: "攻击者",
      dataIndex: "users",
      render: (data, record) => {
        if (data.length) {
          const arr = data.filter((item) => item.status == 2);
          console.log("攻击者", arr);
          return <>{arr[0]?.name}</>;
        } else {
          return <>未知</>;
        }
      },
    },
    {
      title: "防御者",
      dataIndex: "users",
      render: (data, record) => {
        if (data.length) {
          const arr = data.filter((item) => item.status == 3);
          console.log("防御者", arr);
          return <>{arr[0]?.name}</>;
        } else {
          return <>未知</>;
        }
      },
    },
    {
      title: "比赛状态",
      dataIndex: "reserve5",
      render: (data, record) => {
        if (data === "start") {
          return <>比赛进行中</>;
        } else if (data === "end") {
          return <>比赛结束</>;
        } else {
          return <>比赛未开始</>;
        }
      },
    },
    {
      title: "操作",
      render: (_, record) => {
        return (
          <Space>
            <Button
              type="primary"
              onClick={() => handleEdit(record)}
              disabled={
                record.reserve5 === "start" || record.reserve5 === "end"
              }
            >
              开始比赛
            </Button>
            {record.reserve5 === "start" && (
              <>
                <Button type="primary" onClick={() => handleAttact(record)}>
                  攻击
                </Button>
                <Button type="primary" onClick={() => handleDefense(record)}>
                  防御
                </Button>
              </>
            )}
          </Space>
        );
      },
    },
  ];
  const handleAttact = (data) => {
    setStatus("attack");
    setVisible(true);
    console.log("攻击时候的data", data);
    setAttackData(data);
    // axios.get(`/api/myweapon/fire?id=${data.reserve4}`).then(({ data }) => {
    //   if (data.success) {
    //     message.success("攻击成功");
    //   } else {
    //     message.error(data.message);
    //   }
    // });
  };
  const handleDefense = (data) => {
    setStatus("defense");
    setVisible(true);
    setAttackData(data);
  };
  const getData = () => {
    axios.get("/api/match/list").then(({ data }) => {
      setList(data.data);
    });
  };
  const handleDel = (id) => {
    Modal.confirm({
      title: "删除",
      content: "确定要删除此用户吗?",
      onOk: () => {
        axios.get(`/api/user/delete?id=${id}`).then(({ data }) => {
          console.log(data);
          if (data.success) {
            message.success("删除成功");
            fetchList();
          }
        });
      },
    });
  };
  useEffect(() => {
    getData();
    getWeaponList();
  }, []);
  const getWeaponList = () => {
    axios.get("/api/myweapon/list").then(({ data }) => {
      setWeaponList(data.data);
    });
  };
  const onFinish = (data) => {
    const attTemp = attackData.users.filter((item) => item.status == 2);
    const defenTemp = attackData.users.filter((item) => item.status == 3);
    const url = status==='attack'?'/api/myweapon/fire':'/api/myweapon/defense'
    axios
      .get(url, {
        params: {
          id: attackData.id,
          user: status === "attack" ? attTemp[0].name : defenTemp[0].name,
          weaponid: data.weaponid,
        },
      })
      .then(({ data }) => {
        if (data.success) {
          message.info(data.message);
          setVisible(false);
          getData();
          getWeaponList();
        } else {
          message.error(data.message);
        }
        console.log(data, "攻击返回数据");
      })
      .catch(() => {
        message.error("攻击失败");
      });
  };
  const onFinishFailed = () => {
    s;
  };
  return (
    <>
      <Table columns={columns} dataSource={list} key={"id"} />
      <Modal
        title={status === "attack" ? "攻击" : "防御"}
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
            label="请选择武器"
            name="weaponid"
            rules={[{ required: true, message: "Please input your path!" }]}
          >
            <Select>
              {weaponList.map((item) => (
                <Select.Option value={item.id}>{item.name}</Select.Option>
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

export default ManagerUser;
