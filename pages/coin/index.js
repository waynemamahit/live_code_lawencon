import { useActor } from '@xstate/react'
import { message, Spin, Table, Select, Alert, Input, Row, Col } from 'antd'
import axios from 'axios'
import Head from 'next/head'
import { useRouter } from 'next/router'
import React, { useContext, useEffect, useState } from 'react'
import MainLayout from '../../components/MainLayout'
import { GlobalStateContext } from '../../utils'


const { Option } = Select

export default function Coin() {
  const router = useRouter()
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const globalService = useContext(GlobalStateContext)
  const [state, send] = useActor(globalService.coinService)


  const getData = async () => {
    setLoading(true)
    setError(false)
    
    try {
      let response = await axios.get('https://api.coinpaprika.com/v1/coins/')
      response = await response.data
      
      if (!Array.isArray(response)) throw "Data not found"
      
      let types = response.map(typeItem => typeItem.type)
      types = Array.from(new Set(types))

      send({
        type: "TYPE",
        value: types
      })

      send({
        type: "DATA",
        value: response
      })
      

      window['coin'] = response
      
    } catch (error) {

      message.error(`${error}` || "Something went wrong!")
      
      setError(true)

    } finally {
      setLoading(false)
    }
  }

  const onChange = value => {
    let result = window['coin'].filter(coinItem => coinItem.type == value)
    
    send({
      type: "DATA",
      value: result
    })
  }
  
  const onSearch = value => {
    let result = window['coin'].filter(coinItem => {
      let regex = new RegExp(value, 'i')
      return regex.test(coinItem.name) || regex.test(coinItem.symbol)
    })

    send({
      type: "DATA",
      value: result
    })
  }
  
  const goDetail = item => {
    router.push('/coin/' + item.id)
  }

  useEffect(() => {
    getData()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      render: (text, record) => <a style={{ color: 'blue', cursor: "pointer" }} onClick={() => goDetail(record)}>{text}</a>,
      sorter: {
        compare: (a, b) => a.id - b.id,
      },
    },
    {
      title: 'Name',
      dataIndex: 'name',
      sorter: {
        compare: (a, b) => a.name - b.name,
      },
    },
    {
      title: 'Symbol',
      dataIndex: 'symbol',
      sorter: {
        compare: (a, b) => a.symbol - b.symbol,
      },
    },
    {
      title: 'Rank',
      dataIndex: 'rank',
      sorter: {
        compare: (a, b) => a.rank - b.rank,
        multiple: 1,
      },
    },
    {
      title: 'Type',
      dataIndex: 'type',
    },
    {
      title: 'Active',
      dataIndex: 'is_active',
      render: text => <span>{`${text}`}</span>
    },
  ]

  return (
    <>
      <Head>
        <title>Coin Lawencon (Technical Test) | Coin</title>
        <meta name="description" content="Get data crypto coin" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Spin spinning={loading} delay={500} size="large">
        {state.context.coin.length > 0 ? (
          <>
            <h3 className='page-title'>Coin List</h3>
            <Row gutter={[24, 24]}>
              <Col>
                <Select
                  showSearch
                  placeholder="Select type"
                  optionFilterProp="children"
                  onChange={value => onChange(value)}
                  filterOption={(input, option) =>
                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {state.context.types.map((typeItem, typeIndex) => (
                    <Option key={typeIndex} value={typeItem}>{typeItem}</Option>
                  ))}
                </Select>
              </Col>
              <Col>
                <Input.Search 
                  style={{ display: 'inline-block'}} 
                  placeholder="Search"
                  onSearch={value => onSearch(value)} 
                  enterButton   
                />
              </Col>
            </Row>
            <Table 
              columns={columns} 
              dataSource={state.context.coin}
              rowKey={(item) => item.id}
            />
          </>
        ) : null}
        {error ? (
          <Alert
            message="Data not found!"
            description="Click here for reload data."
            type="error"
            showIcon
          />
        ) : null}
      </Spin>
    </>
  )
}

Coin.getLayout = function getLayout(page) {
  return (
    <MainLayout>
      {page}
    </MainLayout>
  )
}