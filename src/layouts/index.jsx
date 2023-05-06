import Side from './side';
import Header from './header';
import Container from './container';
import './layout.less';

const Layout  = ()=>{
    return <>
     <Header/>
     <div className='content'>
        <Side/>
        <Container/>
     </div>
    </>
}
export default Layout