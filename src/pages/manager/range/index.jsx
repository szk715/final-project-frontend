import { useEffect, useState } from "react";
import { Button, Card, Space, Modal, Form, Input, message } from "antd";
import { fetchData, DelData, AddData } from "../../../api/index";
import axios from "axios";
import "./index.less";
const ManagerMirror = () => {
  const [list, setList] = useState([]);
  const [visible, setVisible] = useState(false);
  const [status, setStatus] = useState("add");
  const [form] = Form.useForm();
  useEffect(() => {
    getData();
  }, []);
  const getData = () => {
    axios.get("/api/weapon/list").then(({ data }) => {
      setList(data.data);
    });
  };
  const handleDel = (id) => {
    Modal.confirm({
      title: "确定删除此靶机吗?",
      onOk: () => {
        axios.get(`/api/weapon/delete?id=${id}`).then(({ data }) => {
          console.log(data);
          if (data.success) {
            message.success("删除成功");
            getData();
          }else{
            message.error(data.message)
          }
        });
      },
    });
  };
  const onFinish = (data) => {
    if (status === "add") {
      axios
        .post("/api/weapon/save", {
          reserve5: "",
          status: "",
          ...data,
        })
        .then(({ data }) => {
          if (data.success) {
            getData();
            setVisible(false);
          }else {
            message.error(data.message);
          }
        })
        .catch(() => {
          message.error("新增失败");
        });
    } else {
      axios
        .post("/api/weapon/update", data)
        .then(({ data }) => {
          if (data.success) {
            getData();
            setVisible(false);
          }else {
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
          新增靶机
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
              <p>端口：{item.reserve1}</p>
              <p>ip：{item.reserve2}</p>
              <p>用户：{item.reserve3}</p>
              <p>密码：{item.reserve4}</p>
            </Card>
          ))}
        </Space>
      </div>
      <Modal
        title={status === "add" ? "新增武器" : "编辑武器"}
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
            label="端口号"
            name="reserve1"
            rules={[{ required: true, message: "Please input your path!" }]}
          >
            <Input disabled={status==='edit'}/>
          </Form.Item>
          <Form.Item
            label="ip"
            name="reserve2"
            rules={[{ required: true, message: "Please input your path!" }]}
          >
            <Input disabled={status==='edit'}/>
          </Form.Item>
          <Form.Item
            label="账号"
            name="reserve3"
            rules={[{ required: true, message: "Please input your path!" }]}
          >
            <Input disabled={status==='edit'}/>
          </Form.Item>
          <Form.Item
            label="密码"
            name="reserve4"
            rules={[{ required: true, message: "Please input your path!" }]}
          >
            <Input disabled={status==='edit'}/>
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

export default ManagerMirror;
