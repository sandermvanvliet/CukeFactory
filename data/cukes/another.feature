Feature: tralalallalalalalal

	Scenario: The happy day
		Given I am happy
		When I go and get a coffee
		Then I'll be even more happy

	Scenario: Wilson posts to his own blog
	  Given I am logged in as Wilson
	  When I try to post to "Expensive Therapy"
	  Then I should see "Your article was published."

	Scenario: Wilson fails to post to somebody else's blog
	  Given I am logged in as Wilson
	  When I try to post to "Greg's anti-tax rants"
	  Then I should see "Hey! That's not your blog!"

	Scenario: Greg posts to a client's blog
	  Given I am logged in as Greg
	  When I try to post to "Expensive Therapy"
	  Then I should see "Your article was published."
