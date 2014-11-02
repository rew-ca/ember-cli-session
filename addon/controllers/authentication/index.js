import Ember from 'ember';
import ajax from 'ic-ajax';

export default Ember.ObjectController.extend({

    actions: {
        signIn: function() {

            console.log('api_namespace', this.get('session-config.api_namespace'));

            this.set('signingIn', true);
            ajax({
                type: 'PUT',
                url: '/api_v1/authentication/signin',
                contentType: 'application/json',
                data: JSON.stringify({
                    credential: this.getProperties('email', 'password', 'rememberMe')
                })
            }).then(function() {
                this.set('signingIn', false);

                if (!this.session.tryTransitionOnSignIn())
                    this.transitionToRoute('portal');				
            }.bind(this), function(response) {

                this.set('signingIn', false);
                this.session.showGlobalAlert(response.jqXHR, 6000, 'danger');

            }.bind(this));
        }
    }

});
