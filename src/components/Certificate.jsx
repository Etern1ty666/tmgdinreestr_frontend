import React, { useEffect, useState } from 'react';
import { Button, Descriptions, Flex, Image, Typography, Popconfirm, message, Upload } from 'antd';
import cert from './cert.jpg'
import { DeleteOutlined, PlusOutlined  } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import Link from 'antd/es/typography/Link';

const { Paragraph } = Typography;



const Certificate = () => {
  const { id } = useParams();
  let [authTokens, setAuthTokens] = useState(()=> localStorage.getItem('authTokens') ? JSON.parse(localStorage.getItem('authTokens')) : null)

  const navigate = useNavigate();
  const [certificate, setCertificate] = useState('')

  useEffect(() => {
      getCertificate();
  }, [])

  let getCertificate = async ()=> {
    try {
        let response = await fetch(process.env.REACT_APP_API_URL + "getCertificate?id=" + Number(id), {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + authTokens.access
            },
        })
        const jsonData = await response.json();
        setCertificate(jsonData)
        
        console.log(jsonData)
    } catch (e) {
        console.log(e);
    }
  }
  let items = [
    {
      key: '1',
      span: 'filled',
      label: 'Дата истечения',
      children: <Paragraph copyable>{certificate.expired}</Paragraph>,
  
    },
    {
      key: '2',
      span: 'filled',
      label: 'Информация',
      children: certificate.info===""?<Paragraph >Нет дополнительной информации</Paragraph>:<Paragraph copyable>{certificate.info}</Paragraph>,
    },
  ]
  function generateRandomKey() {
    var r='', l=0;
    do {
         r += Math.random().toString(16).replace(/[01]\./g, '');
    } while (r.length < 32 && l++ < 32);
    return r.substr(-32, 32);
  };
    let saveImage = (info) => {
      
      setFileName(info.file.name);
      console.log(fileName)
      if (info.file.status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === 'done') {
        message.success(`${info.file.name} сохранен`);
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} не удалось сохранить.`);
      }
    }
    const [fileName, setFileName] = useState('')
    const [randomKey, setRandomKey] = useState('')

  let deleteCertificate = async (userId)=> {
    try {
        let response = await fetch(process.env.REACT_APP_API_URL + "deleteCertificate?id="+Number(id), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + authTokens.access
            },
        })
        const jsonData = await response.json();
        if(jsonData === "Error"){
            console.log('Error delete certificate')
        }else{
          console.log(jsonData)
          message.open({
            type: 'success',
            content: 'Удостоверение удалено',
          });
        }
        
    } catch (e) {
        console.log(e);
    }
    }
    let editFile = async ()=> {
      try {
          let response = await fetch(process.env.REACT_APP_API_URL + "editFile", {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
                  'Authorization': 'Bearer ' + authTokens.access
              },
              body:JSON.stringify({'image': randomKey + '_' + fileName, "id": id})
          })
          const jsonData = await response.json();
          if(jsonData === "Error"){
              console.log('Error create employee')
          }else{
            console.log(jsonData)
          }
          
      } catch (e) {
          console.log(e);
      }
  }
  const confirm = (e) => {
    deleteCertificate();
    navigate('/employees/'+Number(certificate.employee));
    console.log(e);
  };
  return (
  <Flex vertical align='center'>
    <br/>
    {
      certificate.image != ""
      ?
      <>
        {
          certificate?.image?.includes('.jpg') ||certificate?.image?.includes('.png')||certificate?.image?.includes('.jpeg')
          ?
            <Image src={process.env.REACT_APP_API_URL+'media/'+certificate.image}/>
          :
            <Link href={process.env.REACT_APP_API_URL+'media/'+certificate.image}>Файл</Link>
        }
      </>
      :
      <>
      <Upload beforeUpload={()=> {setRandomKey(generateRandomKey)}} name={'file'} data={{'uid': randomKey}} headers={{
            'Authorization': 'Bearer ' + authTokens.access
        }} onChange={saveImage} action="https://api-tmg-din-reestr.ru/addImage" listType="picture-card" maxCount={1}>
        <button
          style={{
            border: 0,
            background: 'none',
          }}
          type="button"
        >
          <PlusOutlined />
          <div
            style={{
              marginTop: 8,
            }}
          >
            Загрузить с устройства
          </div>
        </button>
      </Upload>
      <Button onClick={editFile} type="primary" htmlType="submit">
        Сохранить
      </Button>
      </>
    }
    <Descriptions layout='vertical' style={{margin: 20}} bordered items={items}/>
    <Popconfirm
      title="Удалить удостоверение?"
      okText="Да"
      cancelText="Нет"
      onConfirm={confirm}
      
    >
      <Button style={{margin: 20}} type='primary' danger icon={<DeleteOutlined/>}>Удалить удостоверение</Button>
    </Popconfirm>
  </Flex>
  )
}
export default Certificate;
