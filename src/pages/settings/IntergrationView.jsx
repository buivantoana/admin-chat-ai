import React from 'react'
import { Button, Col, Container, Form, Row } from 'react-bootstrap'

const IntergrationView = () => {
   return (
      <div>
         <Container style={{ background: "white", borderRadius: "8px", padding: "20px" }}>
            <h4>Open AI</h4>
            <Row style={{ alignItems: "end" }}>
               <Col md={4}>
                  <Form.Group >
                     <h6>API Key <span style={{ color: "red" }}>*</span></h6>

                     <Form.Control type="text" placeholder="" />
                  </Form.Group>
               </Col>
               <Col md={2}>
                  <Button >Cập nhật</Button>
               </Col>
            </Row>

         </Container>
      </div>
   )
}

export default IntergrationView