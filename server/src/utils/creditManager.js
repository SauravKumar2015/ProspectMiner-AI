const User = require('../models/User');

class CreditManager {
  async checkCredits(userId, requiredCredits) {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    
    if (user.credits < requiredCredits) {
      throw new Error(`Insufficient credits. Need ${requiredCredits} but have ${user.credits}`);
    }
    
    return true;
  }
  
  async deductCredits(userId, amount) {
    const user = await User.findByIdAndUpdate(
      userId,
      { $inc: { credits: -amount } },
      { new: true, runValidators: true }
    );
    
    if (!user) {
      throw new Error('User not found');
    }
    
    if (user.credits < 0) {
      await User.findByIdAndUpdate(userId, { credits: 0 });
      throw new Error('Credit deduction would result in negative balance');
    }
    
    console.log(`💰 Deducted ${amount} credits from user ${userId}. New balance: ${user.credits}`);
    return user.credits;
  }
  
  async addCredits(userId, amount) {
    const user = await User.findByIdAndUpdate(
      userId,
      { $inc: { credits: amount } },
      { new: true }
    );
    
    console.log(`💰 Added ${amount} credits to user ${userId}. New balance: ${user.credits}`);
    return user.credits;
  }
  
  async getBalance(userId) {
    const user = await User.findById(userId).select('credits');
    return user ? user.credits : 0;
  }
}

module.exports = new CreditManager();