all:


push:
	git push web +master:refs/heads/master

pushgithub:
	git push origin +master:refs/heads/master
