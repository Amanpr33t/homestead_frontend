import HomeFieldAgent from "./components/field-agent/HomeFieldAgent";
import NavbarFieldAgent from "./components/field-agent/NavbarFieldAgent";
import PropertiesAdded from "./components/field-agent/PropertiesAdded";
import PropertyDealerAddForm from "./components/field-agent/PropertyDealerAddForm";
import FieldAgentSignIn from "./components/field-agent/FieldAgentSignIn";
import { Route, Routes, Navigate, Link } from 'react-router-dom'


function App() {

  return (
    <div className="box-border w-full min-h-screen">
      <div className="fixed top-40">Hello</div>
      <NavbarFieldAgent />
      <Routes>
        <Route path='/' element={<div className="fixed top-40">hello</div>}></Route>
        <Route path='/demo' element={<div className="fixed top-40">Hello</div>}></Route>
        <Route path='/field-agent/*'>
          <Route path='' element={<HomeFieldAgent />}></Route>
          <Route path='signIn' element={<FieldAgentSignIn />}></Route>
          <Route path='properties-added' element={<PropertiesAdded />}></Route>
          <Route path='add-property-dealer' element={<PropertyDealerAddForm />}></Route>
        </Route>
        <Route path='*' element={<Navigate replace to='/' />}></Route>
      </Routes>
    </div>
  );
}

export default App;
