
import './App.scss';
import { Button, Space, Popconfirm, Table, Input, Select } from 'antd';
import { useEffect, useState } from 'react'
function App() {
  // const [key, setkey] = useState(1);
  const current = new Date();

  let date1 = `${current.getDate()}/${current.getMonth()}/${current.getFullYear()} || ${current.getHours()}:${current.getMinutes()}`
  // console.log(current)
  const [inputdata, setInputdata] = useState({ id: current.getTime(), title: "", body: "", date: date1 });
  const { id, title, body, date } = inputdata;

  const [index, setIndex] = useState()
  const [serch, setSerch] = useState()
  const [uodateadd, setUodateadd] = useState(true)
  const [dataSource, setDataSource] = useState([

  ]);




  async function calldata() {
    const responce = await fetch('https://jsonplaceholder.typicode.com/posts');
    const data = await responce.json();
    setDataSource(data)

  }
  useEffect(
    () => {
      calldata()
    }, []
  )
  // console.log(dataSource)
  // console.log(data);
  function changhandle(e) {
    setInputdata({ ...inputdata, [e.target.name]: e.target.value });

    // console.log(inputdata)
  }

  const handleAdd = async () => {
    await fetch("https://jsonplaceholder.typicode.com/posts", {
      method: "POST",
      body: JSON.stringify({ id, title, body, date:date1 }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    })
      .then((res) => {
        //  setkey(key + 1)
        if (res.status !== 200 || res.status == 404) {

          return;
        } else {
          return res.json();
        }
      })
      .then((data) => {
        setDataSource([...dataSource, { id: current.getTime(), title, body, date: date1 }]);
        // console.log(dataSource);
        setInputdata({ title: "", body: "" });

      })
      .catch((err) => {
        console.log(err);
      });
  };


  const handleDelete = async (key) => {
    await fetch(`https://jsonplaceholder.typicode.com/posts/${key}`, {
      method: "DELETE",
    })
      .then((res) => {
        if (res.status !== 200) {
          return;
        } else {

          // const newData = dataSource.filter((item) => item.key !== key);
          setDataSource(dataSource.filter((item) => item.id !== key));
          // console.log(dataSource);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const addatindex = async () => {
    await fetch(`https://jsonplaceholder.typicode.com/posts/${index}`, {
      method: "PUT",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: index, title, body, date: date1 })
    })
      .then((res) => {
        if (res.status !== 200) {
          return;
        } else {
          const total = [...dataSource]
          total.splice(index - 1, 1, { id: index, title, body, date: date1 });
          setDataSource(total);
          setInputdata({ title: "", body: "" });
          console.log(dataSource);
          setUodateadd(true)

        }
      })
      .catch((err) => {
        console.log(err);
      });
  };



  //! anti desigin 




  // const handleAdd = () => {
  //   setkey(key + 1)
  //  setDataSource([...dataSource, {key,title,body,,date:date1}]);
  //  console.log(dataSource);
  //  setInputdata({title:"",body:""});
  // };

  // const handleDelete = (key) => {
  //     const newData = dataSource.filter((item) => item.key !== key);
  //     setDataSource(newData);
  //   };
  function update(i) {
    console.log(i)
    const updatedata = dataSource.find((item) => item.id == i);
    const { title, body } = updatedata
    // console.log(title,body,"destructring");
    setUodateadd(false)
    setInputdata({ id: i, title: title, body: body });
    setIndex(i)
  }

  // function addatindex(){
  //   console.log(index,"updating")
  //   const total=[...dataSource]
  //   total.splice(index-1,1,{key:index,title,body,,date:date1});
  //   setDataSource(total);
  //   console.log(dataSource);
  //   setUodateadd(true)
  // }
  function changserchhandle(e,) {
    setSerch(e.target.value)
  }
  async function changestatushandler(id, e) {
    console.log(id, e.target.value)
  }
  function serchdata(data) {
    const filterdata = data.filter((item) => item.title?.toLowerCase().includes(serch?.toLowerCase()))
      return filterdata;
  }
  const columns = [
    {
      title: 'Sr No',
      dataIndex: `id`,
      width: "5%",
      align: "center",
    },
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      width: "20%"
      // render: (text) => <a>{text}</a>,
    },
    {
      title: 'Description',
      dataIndex: 'body',
      key: 'body',
    },
    {
      title: 'Time',
      dataIndex: 'date',
      key: 'time',
      width:"10%",
      render:(_,time)=>(
        <p>{time.date}</p>
      )
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: "15%",
      align: "left",

      render: (_, item) => (
       
        <select className='selece-status' onChange={(e) => changestatushandler(item.id, e)} >
          <option disabled value="">Select status</option>
          <option value="Opetn">Open</option>
          <option value="Working">Working</option>
          <option value="Don">Don</option>
        </select>
      ),
    },

    {
      title: 'Action',
      key: 'action',
      width: "20%",
      render: (_, record) => (<>
        <Space size={'large'}>
          {/* // dataSource.length >= 1 ? ( */}
          <Popconfirm title="Sure to delete?" onConfirm={() => handleDelete(record.id)}>
            <a>Delete</a>
          </Popconfirm>
          {/* // ) : null */}
          <a onClick={() => update(record.id)}>Update</a>

        </Space>
      </>
      ),
    },
  ];


  return (
    <div className="App">
      <div className="container-input">

        <input type="text" maxLength={100} onChange={changhandle} name='title' value={title} placeholder='Title' />
        <input type="text" maxLength={100} onChange={changhandle} name='body' value={body} placeholder='Descripiton' />
        <input type="text" onChange={changserchhandle} name='serch' value={serch} placeholder='Serch Title Name' />

      </div>
      <center>
        <Button
          onClick={uodateadd ? handleAdd : addatindex}
          type="primary"
          style={{
            marginBottom: 16,
          }}
        >
          {uodateadd ? "Add a Row" : "Update Data"}

        </Button>
    
      </center>
      <div className="table-container">
        {/* {!shownot?null:<h2 style={{textAlign:"center",color:"red"}}>Data is Not Found</h2>} */}
        <Table
          bordered
          dataSource={!serchdata(dataSource).length > 0 ? dataSource : serchdata(dataSource)}
          columns={columns}
        />

      </div>

    </div>
  );
}

export default App;
