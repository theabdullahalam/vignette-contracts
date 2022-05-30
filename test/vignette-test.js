const { expect } = require("chai");
const { ethers } = require("hardhat");

describe ('Vignette Contract', function(){

  let Vignette;
  let vignette;
  let owner;
  let acc1;
  let acc2;
  let acc3;
  const cid1 = "qwertyuiop";
  const cid2 = "asdfghjkl"
  const cid3 = "zxcvbnm"
  const photographs = [
    [
      'image_cid_1',
      'metadata_cid_1',
      'CC'
    ],
    [
      'image_cid_2',
      'metadata_cid_2',
      'CC'
    ],
    [
      'image_cid_3',
      'metadata_cid_3',
      'CC'
    ],
    [
      'image_cid_4',
      'metadata_cid_4',
      'CC'
    ],
    [
      'image_cid_5',
      'metadata_cid_5',
      'CC'
    ],
  ]

  beforeEach(async function(){
    Vignette = await ethers.getContractFactory("Vignette");
    vignette = await Vignette.deploy();
    [owner, acc1, acc2, acc3] = await ethers.getSigners();
  })

  describe("Accounts", function(){


    it("Should update account metadata", async function(){
      await vignette.updateAccount(cid1)
      const updated_account = await vignette.getAccount(owner.address);
      expect(updated_account.account_metadata_cid).to.equal(cid1);
    })

    it ("Should only update own metadata", async function(){

      await vignette.connect(acc2).updateAccount(cid2);
      await vignette.connect(acc3).updateAccount(cid3);

      const acc2_res = await vignette.getAccount(acc2.address);
      const acc3_res = await vignette.getAccount(acc3.address);

      expect(acc2_res.account_metadata_cid).to.equal(cid2)
      expect(acc3_res.account_metadata_cid).to.equal(cid3)

      expect(acc2_res.account_metadata_cid).to.not.equal(cid3)
      expect(acc3_res.account_metadata_cid).to.not.equal(cid2)

    })


  })

  describe("Photographs", function(){

    function checkPhotographIncludes(contract_res, photograph){
      let includes = false;
      contract_res.forEach(up => {
        if (
          up.image_cid === photograph[0] &&
          up.photograph_metadata_cid === photograph[1] &&
          up.copyright === photograph[2]
        ){
          includes = true
        }
      })
      return includes;
    }

    it("Should publish a photograph", async function(){
      await vignette.connect(owner).publishPhotograph(photographs[0]);
      const published = await vignette.getAllPhotographs();
      expect(checkPhotographIncludes(published, photographs[0])).to.equal(true);
    })

    it("Should fetch correct photographs", async function(){
      await vignette.connect(owner).publishPhotograph(photographs[0]);
      await vignette.connect(acc1).publishPhotograph(photographs[1]);
      await vignette.connect(acc2).publishPhotograph(photographs[2]);

      const owner_pics = await vignette.getPhotographs(owner.address);
      const acc1_pics = await vignette.getPhotographs(acc1.address);
      const acc2_pics = await vignette.getPhotographs(acc2.address);

      expect(checkPhotographIncludes(owner_pics, photographs[0])).to.equal(true)
      expect(checkPhotographIncludes(acc1_pics, photographs[1])).to.equal(true)
      expect(checkPhotographIncludes(acc2_pics, photographs[2])).to.equal(true)

      expect(checkPhotographIncludes(owner_pics, photographs[2])).to.equal(false)
      expect(checkPhotographIncludes(acc1_pics, photographs[0])).to.equal(false)
      expect(checkPhotographIncludes(acc2_pics, photographs[1])).to.equal(false)
    })

    it ("Should fetch correct number of published photographs", async function(){
      await vignette.connect(owner).publishPhotograph(photographs[0]);
      await vignette.connect(owner).publishPhotograph(photographs[1]);
      await vignette.connect(owner).publishPhotograph(photographs[2]);

      await vignette.connect(acc1).publishPhotograph(photographs[3]);
      await vignette.connect(acc1).publishPhotograph(photographs[4]);

      const owner_pics = await vignette.getPhotographs(owner.address);
      const acc1_pics = await vignette.getPhotographs(acc1.address);

      expect(owner_pics.length).to.equal(3)
      expect(acc1_pics.length).to.equal(2)

    })

    it ("Should not allow re-upload of same photograph CID", async function(){
      await vignette.connect(owner).publishPhotograph(photographs[0]);
      await expect(
        vignette.connect(owner).publishPhotograph(photographs[0])
      ).to.be.revertedWith("Photograph with this CID already exists.")      
    })

  })

});