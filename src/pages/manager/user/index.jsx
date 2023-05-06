import { useEffect, useState } from "react";
import { Row, Button, Table, Space, Modal, message, Form, Input } from "antd";
import axios from "axios";
const ManagerUser = () => {
  const [list, setList] = useState([]);
  const [visible, setVisible] = useState(false);
  const [status, setStatus] = useState("add");
  const [form] = Form.useForm();
  const handleEdit = (data) => {
    setStatus("edit");
    setVisible(true);
    console.log(data);
    form.setFieldsValue({ ...data });
  };
  const columns = [
    {
      title: "编号",
      dataIndex: "id",
    },
    {
      title: "用户名",
      dataIndex: "username",
    },
    {
      title: "密码",
      dataIndex: "password",
    },
    {
      title: "type",
      dataIndex: "type",
    },
    {
      title: "操作",
      render: (_, record) => {
        return (
          <Space>
            <Button type="primary" onClick={() => handleEdit(record)}>
              编辑
            </Button>
            <Button type="primary" danger onClick={() => handleDel(record.id)}>
              删除
            </Button>
          </Space>
        );
      },
    },
  ];
  const getData = () => {
    axios.get("/api/user/list").then(({ data }) => {
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
  }, []);
  const onFinish = (data) => {
    if (status === "add") {
      axios
        .post("/api/user/registry", {
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
        .post("/api/user/update", data)
        .then(({ data }) => {
          console.log(data,'~~~~~')
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
  const onFinishFailed = () => {s};
  return (
    <>
      <p>0超级管理员 1 裁判 2攻击者 3 防御者 4 教师</p>
      <Table columns={columns} dataSource={list} key={"id"} />
      <Modal
        title={status === "add" ? "新增用户" : "编辑用户"}
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
            label="账号"
            name="username"
            rules={[{ required: true, message: "Please input your name!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="密码"
            name="password"
            rules={[{ required: true, message: "Please input your path!" }]}
          >
            <Input />
          </Form.Item>
          {status === "edit" && (
            <Form.Item
              label="用户类型"
              name="type"
              rules={[{ required: true, message: "Please input your path!" }]}
            >
              <Input />
            </Form.Item>
          )}
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

export default ManagerUser;
