import Ember from 'ember';
import ajax from 'ic-ajax';

export default Ember.Controller.extend({

    actions: {
        signIn: function() {

            this.set('signingIn', true);
            ajax({
                type: 'POST',
                url: '/' + this.get('session-config.apiNamespace') + '/sessions',
                contentType: 'application/json',
                data: JSON.stringify({
                    user: {
                        email: this.get('model.email'),
                        password: this.get('model.password'),
                        remember_me: this.get('model.rememberMe')
                    }
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
