import { Button ,Modal,Form,Input,Select } from "antd";
import {useState} from 'react';
import axios from "axios";
import { useNavigate } from "react-router-dom";
const Header = () => {
  const navigate = useNavigate();
  const [type, setType] = useState(0);
  const [visible, setVisible] = useState(false);
  const judgeList=[
  {  id:2,
    username:'攻击'},
    {  id:3,
        username:'防御'}
  ]
  const [form] = Form.useForm();
  const onFinish = (data) => {
    // const temp = judgeList.filter((item) => item.username == data.type);

    debugger
    axios
    .post("/api/user/update", {
id:localStorage.getItem("userid"),

      ...data,
    })
    .then(({ data }) => {
      if (data.success) {
        message.success("修改成功");
      } else {
        message.error(data.message);
      }
    })
    .catch(() => {
      message.error("修改失败");
    });
  
  };
  const onFinishFailed = () => {};
  useState(() => {
    const local = localStorage.getItem("type");
    setType(local);
  }, []);
  const handleExit = () => {
    navigate("/login");
    
  };
  const handleEdite = () => {

    setVisible(true);
    form.setFieldsValue({
        username:localStorage.getItem("name"),
        type:localStorage.getItem("type")==2?'攻击':'防御',
     });
    
  };
  return (
    <div className="header">
      <div>网络安全攻防靶场系统</div>
      <div>
        {+type === 0 && <span>管理员</span>}
        {+type === 1 && <span>裁判</span>}
        {+type === 2 && <span>攻击者</span>}
        {+type === 3 && <span>防御者</span>}
        {+type === 4 && <span>教师</span>}
        <Button type="link" onClick={handleExit}>
          退出
        </Button>
        {+type === 3 && 
        <Button type="link" onClick={handleEdite}>
          个人信息修改
        </Button>}
        {+type === 2 && 
        <Button type="link" onClick={handleEdite}>
          个人信息修改
        </Button>}
      </div>
      <Modal
        title={status === "add" ? "修改个人信息" : "修改个人信息"}
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
            name="username"
            rules={[{ required: true, message: "Please input your name!" }]}
          >
            
            <Input />
          </Form.Item>
          <Form.Item
            label="密码"
            name="password"
            rules={[{ required: true, message: "Please input your name!" }]}
          >
            
            <Input />
          </Form.Item>
       
          <Form.Item
            label="角色"
            name="type"
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
    </div>
    
  );
};
export default Header;
