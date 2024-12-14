import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route, useParams } from 'react-router-dom';
import Admin from './components/admin';
import Error404 from './components/admin/page/error404/error404';
import 'bootstrap/dist/css/bootstrap.min.css';
import PrivateRoute from './components/admin/middleware/auth.middleware';
import LoginAdmin from './components/admin/login/index'
import DashboardAdmin from './components/admin/dashboard';
import Client from './components/client';
import HomeClient from './components/client/home';
import LoginClient from './components/client/login';
import RegisterClient from './components/client/register';
import NewsSection from './components/client/news/news';
import AppointmentClient from './components/client/appointment';
import ContactSection from './components/client/contact';
import ServicesSection from './components/client/services';
import Customer from './components/admin/customers';
import CustomerDetail from './components/admin/customers/detail';
import CustomerEdit from './components/admin/customers/edit';

import Services from './components/admin/services';
import ServiceDetail from './components/admin/services/detail';
import ServiceEdit from './components/admin/services/edit';

import Technician from './components/admin/technician';
import TechnicianDetail from './components/admin/technician/details';
import TechnicianEdit from './components/admin/technician/edit';
import CreateTechnician from './components/admin/technician/create';
import CreateService from './components/admin/services/create';
import Appointment from './components/admin/appointment';
import AppointmentDetail from './components/admin/appointment/detail';
import AppointmentEdit from './components/admin/appointment/edit';




function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="admin/login" element={<LoginAdmin />} />
        <Route element={<PrivateRoute />}>
          <Route path="admin" element={<Admin />} >
            <Route path="dashboard" element={<DashboardAdmin />} />

            <Route path="appointments" element={<Appointment />} />
            <Route path="appointments/:id" element={<AppointmentDetail />} />
            <Route path="appointments/edit/:id" element={<AppointmentEdit />} />


            <Route path="customers" element={<Customer />} />
            <Route path="customers/:id" element={<CustomerDetail />} />
            <Route path="customers/edit/:id" element={<CustomerEdit />} />

            <Route path="services" element={<Services />} />
            <Route path="services/:id" element={<ServiceDetail />} />
            <Route path="services/edit/:id" element={<ServiceEdit />} />
            <Route path="services/create" element={<CreateService />} />

            <Route path="technicians" element={<Technician />} />
            <Route path="technicians/:id" element={<TechnicianDetail />} />
            <Route path="technicians/edit/:id" element={<TechnicianEdit />} />
            <Route path="technicians/create" element={<CreateTechnician />} />
          </Route >
        </Route >

        <Route path="/login" element={<LoginClient />} />
        <Route path="/register" element={<RegisterClient />} />
        <Route path="/" element={<Client />} >
          <Route index element={<HomeClient />} />
          <Route path='/dat-lich-rua-xe' element={<AppointmentClient />} />
          <Route path='/news' element={<NewsSection />}/>
          <Route path='/contact' element={<ContactSection />}/>
          <Route path='/services' element={<ServicesSection/>}/>

        </Route>
        <Route path={`/error404`} element={<Error404 />} />
      </Routes>
    </BrowserRouter >
  );
}

export default App;