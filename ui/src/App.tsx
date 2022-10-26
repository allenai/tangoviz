import React from 'react';
import styled from 'styled-components';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { Header, Content, Footer, Layout } from '@allenai/varnish';

import { Home } from './pages/Home';
import { Workspace } from './pages/Workspace';
import { Run } from './pages/Run';
import { Step } from './pages/Step';
import { NoPage } from './pages/NoPage';
import { AppRoute } from './AppRoute';

import tangoLogoSrc from './only_tango.svg';

const ROUTES: AppRoute[] = [
    {
        path: '/',
        label: 'Home',
        component: Home,
    },
];

export const App = () => {
    return (
        <BrowserRouter>
            <Route path="/">
                <Layout bgcolor="white">
                    <Header>
                        <Header.Columns columns="auto 1fr">
                            <Header.Logo
                                href="/"
                                label={<Header.AppName>Tango Reporting</Header.AppName>}>
                                <Logo />
                            </Header.Logo>
                        </Header.Columns>
                    </Header>
                    <Content main>
                        <Switch>
                            {ROUTES.map(({ path, component }) => (
                                <Route key={path} path={path} exact component={component} />
                            ))}
                            <Route path="/workspace/:wsid/run/:rid" component={Run} />
                            <Route path="/workspace/:wsid/step/:sid" component={Step} />
                            <Route path="/workspace/:wsid" component={Workspace} />
                            <Route path="*" component={NoPage} />
                        </Switch>
                    </Content>
                    <Footer />
                </Layout>
            </Route>
        </BrowserRouter>
    );
};

const Logo = styled.img.attrs({
    src: tangoLogoSrc,
    alt: 'Tango Logo',
    height: '53px',
})`
    margin-right: ${({ theme }) => theme.spacing.sm};
`;
