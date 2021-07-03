import * as React from 'react';
import Layout from '../../components/layout';

export interface ProfileProps {

}

const Profile: React.SFC<ProfileProps> = ({ }) => {
    return (
        <Layout>
            <h1>Profile</h1>
        </Layout>
    );
}

export default Profile;