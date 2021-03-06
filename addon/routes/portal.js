import Ember from 'ember';
import ajax from 'ic-ajax';
const { Route } = Ember;

export default Route.extend({
  allowedRoles: [],

  beforeModel(transition) {
    return ajax({
      type: 'GET',
      url: '/' + this.get('session-config.apiNamespace') + '/sessions/me'
    }).then( (response)=> {

      if (!this.allowedRoles.length) {
        this.setUser(response);
        return;
      }

      for (var i = 0; i < this.allowedRoles.length; i++) {
        if (response.user.roles.contains(this.allowedRoles[i])) {
          this.setUser(response);
          return;
        }
      }

      this.redirectToSignIn(transition);

    }, ()=> {
      this.redirectToSignIn(transition);
    });
  },

  setUser(response) {
    this.store.push(this.store.normalize('user', response.user));
    this.session.set('user', this.store.findRecord('user', response.user.id));
  },

  redirectToSignIn(transition) {
    this.session.set('transitionOnSignIn', transition);
    this.replaceWith('authentication');
  },

  actions: {
    error(error, transition) {
      if (error && error.status === 401) {
        // TODO: do a full reload to clear any caches, but set redirect=URL so that user returns to the proper URL.
        this.session.set('userId', null);
        this.session.set('transitionOnSignIn', transition);
        this.transitionTo('authentication');
        return;
      }

      return true;
    }
  }
});
